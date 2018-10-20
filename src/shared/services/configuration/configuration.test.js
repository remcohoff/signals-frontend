import CONFIGURATION, { Configuration } from './configuration';

describe('The configuration service', () => {
  it('should have CONFIGURATION', () => {
    expect(CONFIGURATION).toBeInstanceOf(Configuration);
  });

  it('should return PRODUCTION config', () => {
    const hostname = 'meldingen.amsterdam.nl';
    const config = new Configuration(hostname);

    expect(config.API_ROOT).toEqual('https://api.data.amsterdam.nl/');
    expect(config.ROOT).toEqual('https://meldingen.amsterdam.nl/');
    expect(config.AUTH_ROOT).toEqual('https://api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://api.data.amsterdam.nl/');
  });

  it('should return ACCEPTATION config', () => {
    const hostname = 'acc.meldingen.amsterdam.nl';
    const config = new Configuration(hostname);

    expect(config.API_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.ROOT).toEqual('https://acc.meldingen.amsterdam.nl/');
    expect(config.AUTH_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://acc.api.data.amsterdam.nl/');
  });

  it('should return OPLEIDING config', () => {
    const hostname = 'opleiding.meldingen.amsterdam.nl';
    const config = new Configuration(hostname);

    expect(config.API_ROOT).toEqual('https://api.opleiding.meldingen.amsterdam.nl/');
    expect(config.ROOT).toEqual('https://opleiding.meldingen.amsterdam.nl/');
    expect(config.AUTH_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://api.opleiding.meldingen.amsterdam.nl/');
  });

  it('should by default return DEVELOPMENT config', () => {
    const config = new Configuration();

    expect(config.API_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.ROOT).toEqual('http://localhost:3001/');
    expect(config.AUTH_ROOT).toEqual('https://acc.api.data.amsterdam.nl/');
    expect(config.API_ROOT_MLTOOL).toEqual('https://acc.api.data.amsterdam.nl/');
  });
});
