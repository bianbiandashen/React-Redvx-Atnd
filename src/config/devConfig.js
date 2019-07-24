module.exports = {
    AppDebugName: 'X-web',
    // reduxDevToolServer: 'remotedev.io',
    // reduxDevToolPort: 80,
    reduxDevToolServer: '192.168.31.142',
    reduxDevToolPort: 8157,
    realtime: false,
    enableMock: false,
    mockEntry: {
        dest: 'keyInfo',
        props: {
            keyId: 1,
        },
    },
};
