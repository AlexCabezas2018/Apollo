import * as client from 'prom-client'

const PREFIX = 'apollo_'

export enum AvailableMetrics {
    COMMAND_RESPONSE = 'command_response',
    RESPONSE_TIME = 'response_time'
}

const METRICS_MAP = new Map<AvailableMetrics, any>([
    [AvailableMetrics.COMMAND_RESPONSE, new client.Counter({
        name: PREFIX + AvailableMetrics.COMMAND_RESPONSE,
        labelNames: ["command_name", "status"] as const,
        help: "Responses of command"
    })],
    [AvailableMetrics.RESPONSE_TIME, new client.Summary({
        name: PREFIX + AvailableMetrics.RESPONSE_TIME,
        help: "Time of functions",
        percentiles: [0.01, 0.1, 0.9, 0.99],
        labelNames: ["function_name", "command_name"] as const,
    })]
]);

interface MetricLabels {
    commandName?: string,
    reason?: string,
    functionName?: string
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

    measureTime: async (fn: Function, labels: MetricLabels) => {
        const summary = METRICS_MAP.get(AvailableMetrics.RESPONSE_TIME)
        const measureTime = summary.startTimer({ command_name: labels.commandName, function_name: labels.functionName });
        const result = await fn();
        measureTime();
        return result;
    }
}

export const MetricsExposer = {
    expose: async (): Promise<{ contentType: string, data: any }> => {
        return {
            contentType: register.contentType,
            data: await register.metrics()
        };
    }
}