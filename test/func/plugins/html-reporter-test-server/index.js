'use strict';

const express = require('express');

module.exports = (hermione, pluginConfig) => {
    if (pluginConfig.enabled === false) {
        return;
    }

    if (hermione.isWorker()) {
        return;
    }

    let server;
    const {port = 8080} = pluginConfig;

    hermione.on(hermione.events.RUNNER_START, () => {
        const app = express();
        app.use(express.static(process.cwd()));
        server = app.listen(port, (err) => {
            if (err) {
                throw new Error(`Fail to start test server:\n ${err}`);
            }

            console.info(`Server is listening on http://localhost:${port}`);
        });
    });

    hermione.on(hermione.events.RUNNER_END, () => {
        server.close(() => console.info(`Server was closed`));
    });
};
