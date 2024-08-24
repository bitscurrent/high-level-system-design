import KafkaConfig from "../kafka/kafka.js";

const sendMessageToKafka = async (req, res) => {
   console.log("got here in upload service...");
   try {
       const message = req.body;
       console.log("body:", message);
       const kafkaconfig = new KafkaConfig();
       const msgs = [
           {
               key: "key1",
               value: JSON.stringify(message),
           },
       ];
       await kafkaconfig.produce("transcode", msgs); // No need to assign result if produce doesn't return anything useful
       res.status(200).json("Message uploaded successfully");
   } catch (error) {
       console.log(error);
       res.status(500).json({ error: "Failed to upload message" }); // Adding error response to the client
   }
};

const pushVideoForEncodingToKafka = async (title, url) => {
    try {
        const message = {
            title: title,
            url: url,
        };
        console.log("body:", message);
        const kafkaconfig = new KafkaConfig();
        const msgs = [
            {
                key: "video",
                value: JSON.stringify(message),
            },
        ];
        await kafkaconfig.produce("transcode", msgs); // No need to return a response here
        console.log("Message pushed for encoding");
    } catch (error) {
        console.log("Error pushing video for encoding:", error);
    }
};

export { pushVideoForEncodingToKafka, sendMessageToKafka };


