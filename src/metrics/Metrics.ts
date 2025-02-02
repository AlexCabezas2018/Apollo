import * as client from 'prom-client'

const PREFIX = 'apollo_'

export enum AvailableMetrics {
    COMMAND_RESPONSE = 'command_response'
}

const METRICS_MAP = new Map<AvailableMetrics, any>([
    [AvailableMetrics.COMMAND_RESPONSE, new client.Counter({
        name: PREFIX + AvailableMetrics.COMMAND_RESPONSE,
        labelNames: ["command_name", "status"] as const,
        help: "Responses of command"
    })],
]);

interface MetricLabels {
    commandName?: string,
    reason?: string
}

const register = new client.Registry();

register.setDefaultLabels({
    app: "apollo-server",
});

METRICS_MAP.forEach((metric) => {
    register.registerMetric(metric);
});

client.collectDefaultMetrics({ register });

export const Metrics = {
    incrementSuccess: (metric: AvailableMetrics, labels: MetricLabels) => {
        METRICS_MAP.get(metric).inc({ command_name: labels.commandName, status: "success" });
    },

    incrementError: (metric: AvailableMetrics, labels: MetricLabels) => {
        METRICS_MAP.get(metric).inc({ command_name: labels.commandName, status: "error" });
    },

    expose: async (): Promise<{ contentType: string, data: any }> => {
        return {
            contentType: register.contentType,
            data: await register.metrics()
        };
    }
}