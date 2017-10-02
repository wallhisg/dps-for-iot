"use strict";
var dps = require("dps");

(function () {
    var keyID = [
        [0xed, 0x54, 0x14, 0xa8, 0x5c, 0x4d, 0x4d, 0x15, 0xb6, 0x9f, 0x0e, 0x99, 0x8a, 0xb1, 0x71, 0xf2],
        [0x53, 0x4d, 0x2a, 0x4b, 0x98, 0x76, 0x1f, 0x25, 0x6b, 0x78, 0x3c, 0xc2, 0xf8, 0x12, 0x90, 0xcc]
    ];
    /* Pre-shared keys for testing only. DO NOT USE THESE KEYS IN A REAL APPLICATION! */
    var keyData = [
        [0x77, 0x58, 0x22, 0xfc, 0x3d, 0xef, 0x48, 0x88, 0x91, 0x25, 0x78, 0xd0, 0xe2, 0x74, 0x5c, 0x10],
        [0x39, 0x12, 0x3e, 0x7f, 0x21, 0xbc, 0xa3, 0x26, 0x4e, 0x6f, 0x3a, 0x21, 0xa4, 0xf1, 0xb5, 0x98]
    ];
    var keyStore;
    var node;
    var sub;
    var i;
    var onPub = function (sub, pub, payload) {
        var topics;
        var n;
        var ackMsg;
        console.log("Pub " + dps.publicationGetUUID(pub) + "(" + dps.publicationGetSequenceNum(pub) + ") matches:");
        topics = [];
        n = dps.publicationGetNumTopics(pub);
        for (i = 0; i < n; i += 1) {
            topics.push(dps.publicationGetTopic(pub, i));
        }
        topics.join(" | ");
        console.log("  pub " + topics.join(" | "));
        topics = [];
        n = dps.subscriptionGetNumTopics(sub);
        for (i = 0; i < n; i += 1) {
            topics.push(dps.subscriptionGetTopic(sub, i));
        }
        console.log("  sub " + topics.join(" | "));
        console.log(payload);
        if (dps.publicationIsAckRequested(pub)) {
            ackMsg = "This is an ACK from " + dps.getPortNumber(dps.publicationGetNode(pub));
            console.log("Sending ack for pub UUID " + dps.publicationGetUUID(pub) + "(" + dps.publicationGetSequenceNum(pub) + ")");
            console.log("    " + ackMsg);
            dps.ackPublication(pub, ackMsg);
        }
    };

    /* Set to 1 to enable DPS debug output */
    dps.debug = 1;

    keyStore = dps.createMemoryKeyStore();
    for (i = 0; i < keyID.length; i += 1) {
        dps.setContentKey(keyStore, keyID[i], keyData[i]);
    }

    node = dps.createNode("/", dps.memoryKeyStoreHandle(keyStore), keyID[0]);
    dps.startNode(node, dps.MCAST_PUB_ENABLE_RECV, 0);
    sub = dps.createSubscription(node, ["a/b/c"]);
    dps.subscribe(sub, onPub);
}());
