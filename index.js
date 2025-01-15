"use strict";

/*
 * Copyright © 2025 Aspen James <hello@aspenjames.dev>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */

const express = require("express");
const prom = require("prom-client");
const Sensor = require("sds011-wrapper");

const Gauge = prom.Gauge;
const p25 = new Gauge({
  name: "aqi_p25",
  help: "pm2.5 particulates",
});
const p10 = new Gauge({
  name: "aqi_p10",
  help: "pm10 particulates",
});

const sensor = new Sensor("/dev/ttyUSB0");
sensor
  .setReportingMode("active")
  .then(() => {
    return sensor.setWorkingPeriod(0);
  })
  .then(() => {
    sensor.on("measure", ({ "PM2.5": pm25, PM10: pm10 }) => {
      if (pm25 !== null) {
        p25.set(pm25);
      }
      if (pm10 !== null) {
        p10.set(pm10);
      }
      const date = new Date();
      console.log(
        `${date.toISOString()}: ${JSON.stringify({ "PM2.5": pm25, PM10: pm10 })}`,
      );
    });
  });

const server = express();
const register = prom.register;
server.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

const port = process.env.PORT || 3000;
console.log(`Server listening on port ${port}.`);
server.listen(port);
