import { Client } from '@twilio/conversations'
import { API } from '../api/API'

export class TwilioService {
  static serviceInstance: TwilioService
  static chatClient: Client

  // Create a single service instance
  static getInstance(): TwilioService {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService()
    }
    return TwilioService.serviceInstance
  }

  // Use chat client if don't have instance, create a new chat client
  async getChatClient(twilioToken): Promise<Client> {
    if (!TwilioService.chatClient && !twilioToken) {
      throw new Error('Twilio token is null or undefined')
    }
    if (!TwilioService.chatClient && twilioToken) {
      TwilioService.chatClient = new Client(twilioToken)
      return TwilioService.chatClient
    }
    return Promise.resolve().then(() => TwilioService.chatClient)
  }

  // Manage our token expiration
  addTokenListener(): Client {
    if (!TwilioService.chatClient) {
      throw new Error('Twilio client is null or undefined')
    }
    TwilioService.chatClient.on('tokenAboutToExpire', () => {
      API.createTwilioAccessToken()
        .then((response) => TwilioService.chatClient.updateToken(response.result))
    })

    TwilioService.chatClient.on('tokenExpired', () => {
      API.createTwilioAccessToken()
        .then((response) => TwilioService.chatClient.updateToken(response.result))
    })
    return TwilioService.chatClient
  }
  
  // Gracefully shutting down library instance.
  clientShutdown() {
    TwilioService.chatClient?.shutdown()
    TwilioService.chatClient = null
  }
}