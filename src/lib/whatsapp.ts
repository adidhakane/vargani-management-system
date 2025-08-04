// WhatsApp Integration Service - FREE Implementation
// This service handles WhatsApp group management using WhatsApp URL schemes (100% FREE)

interface WhatsAppResponse {
  success: boolean
  message: string
  data?: unknown
  whatsappUrl?: string // For free implementation
}

class WhatsAppService {
  private groupInviteLink: string
  private groupAdminNumber: string

  constructor() {
    // Free implementation - configure these in environment or hardcode
    this.groupInviteLink = process.env.WHATSAPP_GROUP_INVITE_LINK || 'https://chat.whatsapp.com/your-group-invite-link'
    this.groupAdminNumber = process.env.WHATSAPP_ADMIN_NUMBER || '919876543210' // Group admin's WhatsApp number
  }

  /**
   * FREE METHOD: Generate WhatsApp URL to send invite message
   * @param phoneNumber The phone number to send invite to
   * @param contributorName Name of the contributor
   * @param amount Amount contributed
   * @returns Promise<WhatsAppResponse>
   */
  async sendInviteViaURL(phoneNumber: string, contributorName: string = '', amount: number = 0): Promise<WhatsAppResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber)
      
      if (!this.isValidPhoneNumber(phoneNumber)) {
        return {
          success: false,
          message: 'Invalid phone number format'
        }
      }

      // Create personalized message
      const message = this.createInviteMessage(contributorName, amount)
      
      // Create WhatsApp URL that opens WhatsApp with pre-filled message
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
      
      console.log(`📱 FREE WhatsApp Integration: Generated invite URL for ${formattedPhone}`)
      console.log(`Message: ${message}`)
      console.log(`WhatsApp URL: ${whatsappUrl}`)
      
      return {
        success: true,
        message: 'WhatsApp invite URL generated successfully',
        data: {
          phoneNumber: formattedPhone,
          contributorName,
          amount
        },
        whatsappUrl
      }

    } catch (error) {
      console.error('Error generating WhatsApp invite URL:', error)
      return {
        success: false,
        message: 'Failed to generate WhatsApp invite URL'
      }
    }
  }

  /**
   * FREE METHOD: Notify admin about new contributor (for manual group addition)
   * @param phoneNumber The contributor's phone number
   * @param contributorName Name of the contributor
   * @param amount Amount contributed
   * @returns Promise<WhatsAppResponse>
   */
  async notifyAdminForManualAddition(phoneNumber: string, contributorName: string = '', amount: number = 0): Promise<WhatsAppResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber)
      
      // Create admin notification message
      const adminMessage = `🏠 नवीन गणेशोत्सव योगदानकर्ता!\n\n` +
        `👤 नाव: ${contributorName || 'नाव नाही दिले'}\n` +
        `💰 योगदान: ₹${amount}\n` +
        `📱 फोन: +${formattedPhone}\n` +
        `🔗 गट लिंक: ${this.groupInviteLink}\n\n` +
        `⚡ कृपया या योगदानकर्त्याला WhatsApp गटात जोडा किंवा गट लिंक पाठवा.\n\n` +
        `📋 संदेश टेम्प्लेट:\n` +
        `"🙏 गणपती बाप्पा मोरया ${contributorName || 'मित्रा'}! ₹${amount} च्या योगदानाबद्दल धन्यवाद! आमच्या समुदायात सामील व्हा: ${this.groupInviteLink}"`
      
      // Create WhatsApp URL to send message to admin
      const adminWhatsAppUrl = `https://wa.me/${this.groupAdminNumber}?text=${encodeURIComponent(adminMessage)}`
      
      console.log(`👨‍💼 Admin notification generated for new contributor ${contributorName}`)
      console.log(`Admin WhatsApp URL: ${adminWhatsAppUrl}`)
      
      return {
        success: true,
        message: 'Admin notification generated - manual group addition required',
        data: {
          phoneNumber: formattedPhone,
          contributorName,
          amount,
          adminNotification: true
        },
        whatsappUrl: adminWhatsAppUrl
      }

    } catch (error) {
      console.error('Error generating admin notification:', error)
      return {
        success: false,
        message: 'Failed to generate admin notification'
      }
    }
  }

  /**
   * Create personalized invite message
   */
  private createInviteMessage(contributorName: string, amount: number): string {
    const greeting = contributorName ? `${contributorName}` : 'मित्रा'
    const amountText = amount > 0 ? ` ₹${amount} च्या उदार योगदानाबद्दल` : ''
    
    return `🙏 गणपती बाप्पा मोरया! ${greeting}!\n\n` +
      `${amountText} मनापासून धन्यवाद! आमच्या गणेशोत्सवासाठी तुमचे योगदान अमूल्य आहे! 🏠✨\n\n` +
      `🎉 आमच्या गणेशोत्सव WhatsApp समुदायात सामील व्हा आणि आनंद वाटा:\n` +
      `• 📸 कार्यक्रमाचे फोटो आणि व्हिडिओ\n` +
      `• 🎵 सांस्कृतिक कार्यक्रमाची वेळ\n` +
      `• 🍽️ प्रसाद वितरणाची माहिती\n` +
      `• 🎭 आरती आणि पूजेची वेळ\n` +
      `• 🤝 समुदायाची सर्व अपडेट्स\n\n` +
      `आमच्या गटात सामील व्हा: ${this.groupInviteLink}\n\n` +
      `🌟 एकत्र उत्सव साजरा करूया!\n` +
      `गणपती बाप्पा मोरया! मंगलमूर्ती मोरया! 🐘🙏✨`
  }

  /**
   * Format phone number to include country code
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    let cleaned = phoneNumber.replace(/\D/g, '')
    
    // If number starts with 0, replace with country code (assuming India +91)
    if (cleaned.startsWith('0')) {
      cleaned = '91' + cleaned.substring(1)
    } else if (!cleaned.startsWith('91') && cleaned.length === 10) {
      // If it's a 10-digit number, add India country code
      cleaned = '91' + cleaned
    }
    
    return cleaned
  }

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 15
  }

  /**
   * Legacy method for backward compatibility - now uses free URL method
   */
  async addToGroup(phoneNumber: string, groupId: string): Promise<WhatsAppResponse> {
    // For free implementation, we'll generate URL instead of API call
    return this.sendInviteViaURL(phoneNumber)
  }
}

const whatsAppServiceInstance = new WhatsAppService()

export default whatsAppServiceInstance
