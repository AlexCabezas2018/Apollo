import { MessageType } from "../utils/MessageTypes";
import Listener from "./Listener";
import { Logger } from "../utils/Logger";
import { AvailableMetrics, Metrics } from "../metrics/Metrics";

export default class MetricsListener extends Listener {
    setup(): void {
        // SUCCESS METRICS
        this.eventEmitter.on(MessageType.PLAY_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("play");
        });

        this.eventEmitter.on(MessageType.PLAY_COMMAND_SEARCH_BY_TERM_SUCCESS, () => {
            this.incrementSuccess("search_by_term");
        });

        this.eventEmitter.on(MessageType.STOP_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("stop");
        });

        this.eventEmitter.on(MessageType.PAUSE_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("pause");
        });

        this.eventEmitter.on(MessageType.RESUME_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("resume");
        });

        this.eventEmitter.on(MessageType.NEXT_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("next");
        });

        this.eventEmitter.on(MessageType.QUEUE_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("queue");
        });

        this.eventEmitter.on(MessageType.QUEUE_COMMAND_NO_QUEUE_RESPONSE, () => {
            this.incrementSuccess("queue");
        });

        this.eventEmitter.on(MessageType.SELECT_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("select");
        });

        this.eventEmitter.on(MessageType.CHANGE_LANGUAGE_COMMAND_SUCCESS_RESPONSE, () => {
            this.incrementSuccess("change_language");
        });

        // ERROR METRICS
        this.eventEmitter.on(MessageType.PLAY_COMMAND_RESOURCE_ERROR, () => {
            this.incrementError("play", MessageType.PLAY_COMMAND_RESOURCE_ERROR);
        });

        Logger.debug("Metrics listener ON.");
    }

    private incrementSuccess(commandName: string) {
        Metrics.incrementSuccess(AvailableMetrics.COMMAND_RESPONSE, {
            commandName: commandName,
        });
    }

    private incrementError(commandName: string, reason: string) {
        Metrics.incrementError(AvailableMetrics.COMMAND_RESPONSE, {
            commandName: commandName,
            reason: reason
        });
    }
}