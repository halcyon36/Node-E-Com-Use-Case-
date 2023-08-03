import pkg from '@azure/service-bus';
const { ServiceBusClient, ServiceBusMessage } = pkg;
const connectionString = "Endpoint=sb://mqnamespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=AQhcIm1LVyZmD8FJoXfaa6V8fz8MAGVsq+ASbLgS/H8="
export const publishEventtoServiceBus=async(queueName,eventType,message)=>
{
    const sBusClient = new ServiceBusClient(connectionString)
    const sender = sBusClient.createSender(queueName)
    try
    {
        const messageToAdd = {EventType:eventType,Message:message}
        await sender.sendMessages({body:messageToAdd})
        console.log(`${JSON.stringify(messageToAdd)} is sent successfully to ${queueName} Queue`)
        await sender.close();
    }
    catch(err)
    {
        console.log(`unable to send message, Error:${err.message}`)
    }
    finally
    {
        await sBusClient.close();
    }
}
