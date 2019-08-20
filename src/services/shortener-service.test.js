import ShortenerService from "./shortener-service"

it('shortens a long link', () => {
    const shortenService = new ShortenerService();
    expect(
        shortenService.getShorten("https://pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual("c05859");

    expect(
        shortenService.getShorten("http://pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual("c05859");

    expect(
        shortenService.getShorten("pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual("c05859")
});

it('validates a link', () => {
    const shortenService = new ShortenerService();
    expect(
        shortenService.validateUrl("https://pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual(true);

    expect(
        shortenService.validateUrl("htps://pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual(false);

    expect(
        shortenService.validateUrl("pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual(false);

    expect(
        shortenService.validateUrl("https://pp.userapi.com/c841326/v841326854/3c4cc/U9YM_CafcyU.jpg")
    ).toEqual(true)
});
