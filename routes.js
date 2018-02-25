exports = module.exports = [
    //Dashoboard
    ['/dashboard',
        'dashboard-controller#get',
        'GET'],

    //Exchange
    ['/api/v1/exchange/:exchange_name',
        'exchange-controller#get',
        'GET'],

    ['/api/v1/exchange',
        'exchange-controller#create',
        'utils#jsonParser',
        'POST'],

    //['/api/v1/exchange/:exchange_name',
    //    'exchange-controller#update',
    //    'utils#jsonParser',
    //    'PUT'],

    ['/api/v1/exchange/:exchange_name',
        'exchange-controller#remove',
        'DELETE'],


    // Queue
    //['/api/v1/exchange/:exchange_name/queue/:queue_name',
    //    'queue-controller#get',
    //    'GET'],

    ['/api/v1/exchange/:exchange_name/queue',
        'queue-controller#create',
        'utils#jsonParser',
        'POST'],

    //['/api/v1/exchange/:exchange_name/queue/:queue_name',
    //    'queue-controller#update',
    //    'utils#jsonParser',
    //    'PUT'],

    ['/api/v1/exchange/:exchange_name/queue/:queue_name',
        'queue-controller#remove',
        'DELETE'],

    ['/api/v1/exchange/:exchange_name/queue/:queue_name/mapping',
        'queue-controller#addMapping',
        'utils#jsonParser',
        'POST'],

    ['/api/v1/exchange/:exchange_name/queue/:queue_name/mapping/:routing_key',
        'queue-controller#removeMapping',
        'utils#jsonParser',
        'DELETE'],

    // Messages
    ['/api/v1/exchange/:exchange_name/message',
        'exchange-controller#publishMessage',
        'utils#jsonParser',
        'POST'],

    ['/api/v1/exchange/:exchange_name/queue/:queue_name/message',
        'queue-controller#fetchMessage',
        'utils#jsonParser',
        'GET'],

    ['/api/v1/exchange/:exchange_name/queue/:queue_name/message/acknowledge',
        'queue-controller#acknowledgeMessage',
        'utils#jsonParser',
        'POST']
];