const kafka    = require('./kafka');         // Import shared Kafka config
const producer = kafka.producer();           // Create a producer instance

async function sendOrderEvent() {

  // 1️⃣ Connect to Kafka
  await producer.connect();
  console.log('✅ Producer connected to Kafka!');

  // 2️⃣ Send a message to the "orders" topic
  await producer.send({
    topic:    'orders',               // Which topic to send to
    messages: [
      {
        key:   'order-001',           // Optional: used for partitioning
        value: JSON.stringify({        // The actual message data (must be a string)
          orderId: 'ORD-001',
          item:    'Laptop',
          price:   999,
          status:  'placed',
        }),
      },
    ],
  });

  console.log('📤 Order event sent successfully!');

  // 3️⃣ Disconnect when done
  await producer.disconnect();
}

// Run it!
sendOrderEvent().catch(console.error);
