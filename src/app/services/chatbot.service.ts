import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  choices: { message: ChatMessage }[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = environment.openaiApiUrl || 'https://api.openai.com/v1/chat/completions';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    if (!environment.openaiApiKey) {
      throw new Error('OpenAI API key is not configured.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.openaiApiKey}`,
      'Content-Type': 'application/json'
    });

    const body: ChatRequest = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    };

    return this.http.post<ChatResponse>(this.apiUrl, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error && error.error.error && error.error.error.message) {
      console.error('OpenAI API Error:', error.error.error.message);
    } else if (error.status === 404) {
      console.error('OpenAI API Endpoint Not Found:', error);
    } else {
      console.error('Unexpected Error:', error);
    }

    return throwError(() => new Error('Failed to get a response from OpenAI.'));
  }
}
