# 🍽️ Spice & Soul Chatbot 🤖

Spice & Soul Chatbot is a friendly, conversational restaurant reservation assistant designed for an Indian dining experience.  
It provides a clean, chat-based interface for users to browse the menu and book tables smoothly — **entirely on the frontend**.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![HTML](https://img.shields.io/badge/html-5-orange)
![CSS](https://img.shields.io/badge/css-3-blue)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow)


## ✨ Features

- 🍽️ **Interactive Menu Viewer**  
  Browse categorized menu items with dietary tags

- 💬 **Conversational Table Booking**  
  Step-by-step chat flow that collects:
  - Name
  - Email (validated)
  - Phone number (validated)
  - Date (flexible formats)
  - Time (quick-select buttons)
  - Guest count (1–6)
  - Dietary preference

- 🎯 **Quick Reply Buttons**  
  Reduce typing with predefined options for faster interaction

- 🧠 **Input Validation**
  - Accepts multiple date formats (`12-05-26`, `12/5/26`)
  - Prevents past dates
  - Validates email and phone numbers
  - Enforces guest limits

- 📝 **Editable Booking Summary**
  Review and modify details before confirmation

- ✅ **Booking Confirmation Simulation**
  - Random table number assignment
  - Confirmation shown in chat (email/SMS simulated)


## 🛠️ Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript


## 🚀 Getting Started

### Prerequisites
- Any modern web browser


## ▶️ Running the Project

**Simply open the file:** index.html


💬 Interaction Examples

### Booking a Table

```text
User: I want to book a table
Bot: Sure! For which date?
User: 12/5/26
Bot: Great! How many guests?
User: 4
Bot: Perfect. Shall I confirm your booking?
```


## 📂 Project Structure 

```text
project/
├── public/
│   ├── bot.png
│   ├── hero.jpg
│   └── user.png
├── index.html
├── main.js
├── style.css
└── README.md
```

---