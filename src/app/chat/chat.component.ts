import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  title = 'chatbot-app';
  messages: { user: string; text: string }[] = [];
  userInput: string = '';
  loading: any;

  constructor(private chatbotService: ChatbotService) {} // Inject the service

  sendMessage(): void { 
    if (!this.userInput.trim()) return;
    if (this.loading) {  // Prevent sending while loading
      return;
    }
    this.loading = true; // Start loading spinner


    this.messages.push({ user: 'You', text: this.userInput });

    this.chatbotService.sendMessage(this.userInput).subscribe({
      next: (response) => {
        this.messages.push({ user: 'Bot', text: response.choices[0].message.content });
      },
      error: (error) => {  
        if (error.status === 429) { // Check for rate limit error
          this.messages.push({ user: 'Bot', text: 'Too many requests. Please wait a few moments and try again.' });
        } else {
        this.messages.push({ user: 'Bot', text: 'Too many requests. Please wait a few moments and try again.' });
        }
      },
      complete: () => {
        this.userInput = '';
        this.loading = false; // Stop loading spinner
      }
    });
  }
}


