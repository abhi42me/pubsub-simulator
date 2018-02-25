var InvalidInputException = require('../errors/error-types').InvalidInputException;

function Exchange(name) {
    this.name = name;
    this.queues = {};
    this.routing_key_map = {};
}

Exchange.prototype.checkForQueue = function (queue_name) {
    if (!this.queues[queue_name]) {
        throw new InvalidInputException("Queue doesn't exist in this exchange");
    }
};

Exchange.prototype.addQueue = function (queue_name) {
    if (!this.queues[queue_name]) {
        this.queues[queue_name] = [];
    }
};

Exchange.prototype.removeQueue = function (queue_name) {
    this.checkForQueue(queue_name);
    if (this.queues[queue_name]) {
        delete this.queues[queue_name];
        var routine_keys = Object.keys(this.routing_key_map);
        for (var key of routine_keys) {
            if (this.routing_key_map[key].has(queue_name)) {
                this.routing_key_map[key].remove(queue_name);
            }
        }
    }
};

Exchange.prototype.addMapping = function (queue_name, mapping) {
    this.checkForQueue(queue_name);
    if (this.queues[queue_name]) {
        if (!this.routing_key_map[mapping]) {
            this.routing_key_map[mapping] = new Set();
        }

        if (!this.routing_key_map[mapping].has(queue_name)) {
            this.routing_key_map[mapping].add(queue_name);
        }

        return;
    }

    throw new InvalidInputException("Queue is not binded with the exchange");
};

Exchange.prototype.removeMapping = function (queue_name, mapping) {
    if (this.queues[queue_name] && this.routing_key_map[mapping] && this.routing_key_map[mapping].has(queue_name)) {
        this.routing_key_map[mapping].remove(queue_name);
    }
};

Exchange.prototype.addMessage = function (routing_key, data) {
    var queues = this.routing_key_map[routing_key];
    if (queues) {
        var queueArray = Array.from(queues);
        for (var queue of queueArray) {
            this.queues[queue].push({
                "routing_key": routing_key,
                "data": data
            });
        }
    }
};

Exchange.prototype.getMessages = function (queue_name, count) {
    this.checkForQueue(queue_name);
    if (this.queues[queue_name] && this.queues[queue_name].length > 0) {
        var messages = this.queues[queue_name].slice(0, count);
        return messages;
    }
    return [];
};

Exchange.prototype.removeMessages = function (queue_name, count) {
    this.checkForQueue(queue_name);
    if (this.queues[queue_name] && this.queues[queue_name].length > 0) {
        this.queues[queue_name].splice(0, count);
    }
};

Exchange.prototype.toJSON = function () {
    var queues = Object.keys(this.queues);
    var queue_routing_key_map = {};
    for (var queue of queues) {
        queue_routing_key_map[queue] = {
            "name": queue,
            "routing_keys": [],
            "message_count": this.queues[queue].length
        };
    }

    var routing_keys = Object.keys(this.routing_key_map);
    for (var routing_key of routing_keys) {
        var mapped_queues = this.routing_key_map[routing_key];
        if (mapped_queues) {
            var queueArray = Array.from(mapped_queues);
            for (var queue of queueArray) {
                queue_routing_key_map[queue]["routing_keys"].push(routing_key);
            }
        }
    }

    var queue_list = [];
    for (var queue of queues) {
        queue_list.push(queue_routing_key_map[queue]);
    }

    return {
        "name": this.name,
        "queues": queue_list
    };
};

module.exports = Exchange;