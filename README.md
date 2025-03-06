# Meshtastic Hub

A Meshtastic Hub for managing MQTT-based communication, with time-based access control, dynamic topic rules, and future integrations.

## Connecting Meshtastic to the MQTT Broker via ngrok

### Create an ngrok Tunnel

To expose your local MQTT broker, run:

```sh
ngrok tcp 1883
```

This will output an address like:

```sh
Forwarding tcp://0.tcp.ngrok.io:12345 -> localhost:1883
```

Use this address in the next step.

### Configure Meshtastic to Use ngrok

In the Meshtastic app (or device configuration), set:

* MQTT Broker: `tcp://4.tcp.ngrok.io:12345`
* Port: (Use the port from ngrok output)
* TLS: `Disabled`
* Username & Password: (Leave empty unless authentication is enabled)

Now, your Meshtastic devices can send MQTT messages through meshtastic-hub.
