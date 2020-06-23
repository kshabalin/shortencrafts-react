// SW Version
const version = '1.2';

// Static Cache - App Shell
const appAssets = [
    'index.html',
    'images/flame.png',
    'images/logo.png',
    'images/sync.png',
    'css/font-awesome.css',
    'static/js/bundle.js',
    'static/js/0.chunk.js',
    'static/js/main.chunk.js'
];

let db;

const connectDB = () => {
    const openRequest = indexedDB.open("swLinksDB", 1);
    openRequest.onerror = () => console.error("Error on db opening", openRequest.error);
    openRequest.onsuccess = () => db = openRequest.result;
    openRequest.onupgradeneeded = function() {
        const db = openRequest.result;
        if (!db.objectStoreNames.contains('links')) {
            db.createObjectStore('links', {keyPath: 'id'});
        }
    };
};

// SW Install
self.addEventListener( 'install', e => {
    e.waitUntil(
        caches.open( `static-${version}` )
            .then( cache => {
                cache.addAll(appAssets);
            } )
    );
    connectDB();
});

// SW Activate
self.addEventListener( 'activate', e => {
    // Clean static cache
    let cleaned = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== `static-${version}` && key.match('static-') ) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(cleaned);
});


// Static cache startegy - Cache with Network Fallback
const staticCache = ( req, cacheName = `static-${version}` ) => {

    return caches.match(req).then( cachedRes => {

        // Return cached response if found
        if(cachedRes) return cachedRes;

        // Fall back to network
        return fetch(req).then ( networkRes => {

            // Update cache with new response
            caches.open(cacheName)
                .then( cache => cache.put( req, networkRes ));

            // Return Clone of Network Response
            return networkRes.clone();
        });
    });
};

// Network with Cache Fallback
const fallbackCache = (req) => {

    // Try Network
    return fetch(req).then( networkRes => {

        // Check res is OK, else go to cache
        if( !networkRes.ok ) throw 'Fetch Error';

        // Update cache
        caches.open( `static-${version}` )
            .then( cache => cache.put( req, networkRes ) );

        // Return Clone of Network Response
        return networkRes.clone();
    })

    // Try cache
        .catch( err => caches.match(req) );
};

// // SW Fetch
self.addEventListener('fetch', e => {

    if (e.request.clone().method === 'GET') {
        e.respondWith( staticCache(e.request) );
    } else if (e.request.clone().method === 'POST') {
        // attempt to send request normally
        e.respondWith(fetch(e.request.clone())
            .then(function(response) {
                // If it works, put the response into IndexedDB
                cachePut(e.request.clone(), response.clone());
                return response;
            })
            .catch(function(error) {
                // If it does not work, return the cached response. If the cache does not
                // contain a response for our request, it will give us a 503-response
                console.log(error);
                return cacheMatch(e.request.clone());
            }));
    }
});

/**
 * Serializes a Request into a plain JS object.
 *
 * @param request
 * @returns Promise
 */
function serializeRequest(request) {
    var serialized = {
        url: request.url,
        headers: serializeHeaders(request.headers),
        method: request.method,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
    };

    // Only if method is not `GET` or `HEAD` is the request allowed to have body.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return request.clone().text().then(function(body) {
            serialized.body = body;
            return Promise.resolve(serialized);
        });
    }
    return Promise.resolve(serialized);
}

/**
 * Serializes a Response into a plain JS object
 *
 * @param response
 * @returns Promise
 */
function serializeResponse(response) {
    var serialized = {
        headers: serializeHeaders(response.headers),
        status: response.status,
        statusText: response.statusText
    };

    return response.clone().text().then(function(body) {
        serialized.body = body;
        return Promise.resolve(serialized);
    });
}

/**
 * Serializes headers into a plain JS object
 *
 * @param headers
 * @returns object
 */
function serializeHeaders(headers) {
    var serialized = {};
    // `for(... of ...)` is ES6 notation but current browsers supporting SW, support this
    // notation as well and this is the only way of retrieving all the headers.
    for (var entry of headers.entries()) {
        serialized[entry[0]] = entry[1];
    }
    return serialized;
}

/**
 * Creates a Response from it's serialized version
 *
 * @param data
 * @returns Promise
 */
function deserializeResponse(data) {
    return Promise.resolve(new Response(data.body, data));
}

/**
 * Saves the response for the given request eventually overriding the previous version
 *
 * @param data
 * @returns Promise
 */
function cachePut(request, response) {
    let key, data;
    getPostId(request.clone())
        .then(function(id){
            key = id;
            return serializeResponse(response.clone());
        }).then(function(serializedResponse) {
        data = serializedResponse;
        const entry = {
            id: key,
            response: data
        };
        const links = getLinkStore();
        const txRequest = links.add(entry);
        txRequest.onsuccess = () => console.log("Link has been added", txRequest.result);
        txRequest.onerror = () => console.log("Error", txRequest.error);
    });
}

/**
 * Returns the cached response for the given request or an empty 503-response  for a cache miss.
 *
 * @param request
 * @return Promise
 */
function cacheMatch(request) {
    return getPostId(request.clone())
        .then(
            function (id) {
                return new Promise(function (resolve, reject) {
                    const links = getLinkStore();
                    const link = links.get(id);
                    link.onsuccess = (e) => resolve(e.target.result);
                    link.onerror = (e) => reject(e);
                });
            }
        )
        .then(function(data){
            if (data) {
                return deserializeResponse(data.response);
            } else {
                return new Response('', {status: 503, statusText: 'Service Unavailable'});
            }
        })
        .catch((err) => console.log(err));
}

const getLinkStore = () => db.transaction("links", "readwrite").objectStore("links");

/**
 * Returns a string identifier for our POST request.
 *
 * @param request
 * @return string
 */
const getPostId = (request) => {
    return serializeRequest(request.clone())
        .then((res) => JSON.stringify(res))
        .catch((err) => console.log(err));
};

