const kafka    = require('./kafka');          // Import shared Kafka config
const consumer = kafka.consumer({
  groupId: 'payment-service-group',    // Your consumer group name
});

async function startConsumer() {

  // 1️⃣ Connect to Kafka
  await consumer.connect();
  console.log('✅ Consumer connected to Kafka!');

  // 2️⃣ Subscribe to the "orders" topic
  await consumer.subscribe({
    topic:         'orders',
    fromBeginning: true,             // true = read from the very first message
  });

  // 3️⃣ Run — listens forever, calls callback for each new message
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      // Parse the raw message value back to an object
      const order = JSON.parse(message.value.toString());

      console.log(`📥 New message received!`);
      console.log(`   Topic:     ` + topic);
      console.log(`   Partition: ` + partition);
      console.log(`   Offset:    ` + message.offset); // Message number
      console.log(`   Order:     `, order);

      // ✅ Your business logic goes here!
      await processPayment(order);
    },
  });
}

// Dummy payment processor — replace with your real logic
async function processPayment(order) {
  console.log(`💳 Processing payment for order ` + order.orderId);
  // charge card, update DB, etc.
}

startConsumer().catch(console.error);