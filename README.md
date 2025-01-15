# Raspberry Pi Air Quality Sensor

Small Node.js server to read [particulate matter
levels](https://www.epa.gov/pm-pollution/particulate-matter-pm-basics) from a
[SDS011 sensor](https://aqicn.org/sensor/sds011/), and emit to
[Prometheus](https://prometheus.io/).

## Dependencies

Node.js, npm, dependencies listed in `package.json`, and optionally systemd for
deployment.

## Deployment

Clone this repo to `/home/aspen/sensor`, then:
```sh
cd /home/aspen/sensor
npm i
sudo mv /home/aspen/sensor/systemd/aqi.service /etc/systemd/system/aqi.service
sudo systemctl daemon-reload
sudo systemctl enable aqi
sudo systemctl start aqi
```
