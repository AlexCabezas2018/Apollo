# Apollo for Geeks 🤓
If you are in this section that means that you want to know how the app is built. Fantastic! Let's dive a bit into some
details.

## Architecture
[Here](/docs/geeky/diagram.png) you will see how the app was built. One image is worth a million words, but let me explain a bit:
- The whole backend can be divided in two sections: **Logic** and **Listeners**
- Logic section is the one that receives the interaction from Discord, process the request, maps the corresponding command
and executes the logic.
- Listeners section is meant to decouple the request processing from the actual response. Commands should have a single
responsibility, which is to generate a response. But who must process the response and send it back to Discord? These are the listeners.
- So, whenever a Command is processes and a response is generated (For example, a success response from a play command, telling the user
that the song will be played), it talks with the Publisher, which is the intermediate interface where the app communicates the Commands with the listeners
- Then, the publisher emits the event, and the specific listener receives it, and process the response.
- Apart from the Command Listeners, which attend to process the event that was emitted for the specific command, we have another listener, the Metrics one.
- This "special" (it doesn't have anything special, but it's not associated with any command) Listener is the one that take count for the metrics.
- With that, the other listeners have only one responsibility, which is to process the response. The metrics listener has only one thing to do: manage the metrics based
on the events, and the rest of the logic process the request.

So, in the end, we can extrapolate the work of the app in these steps:
1. The Server receives an interaction (the user attempted to execute a command)
2. The Server deduces the command and execute it.
3. The Command generates a response and invokes the Publisher
4. The Publisher generates an event and is sent to the command Listeners + the metrics listener
5. The Command Listener receives the event and process the response.
6. The Metrics Listener receives the event and update the metrics.

## Metrics
As we explained in the README, if you decide to run the project using docker, the metrics that are generated via Prometheus will be
grabbed by grafana, by getting them using the `/metrics` endpoint that is running in a separated HTTP server.

The metrics that are exposed are:
- `apollo_command_response`: It reports the response for the commands. It can be filtered by `status` (success or error) and
`command_name` ("play", "stop", "next", ...)
- `apollo_response_time`: It measures the time (by percentile) of the third party libraries (to get the audio or the search list)
It can be filtered by `command_name` and `function_name` ("search", "play").
- System metrics: Those are exposed thanks to `cadvisor`. It's a collection metrics useful to know the amount of memory used by the container, the number
of processes, etc.

Grafana is exposed in port `3000` and it will contain a main dashboard with the metrics that we mentioned before, but, if the app
is executed locally, the server will expose those metrics in port `3001`. You can check them by accessing to the `/metrics` endpoint.