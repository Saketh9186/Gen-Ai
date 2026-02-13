document.addEventListener("DOMContentLoaded", function () {
  var appDiv = document.getElementById('app');
  if (!appDiv) {
    console.error("App container not found");
    return;
  }

  appDiv.innerHTML = `
    <div class="container">
      <div class="left-side">
        <div class="overlay"></div>
        <div class="text-content">
          <h1>Spice & Soul</h1>
          <p>Reservations made simple</p>
        </div>
      </div>

      <div class="right-side">
        <button class="view-menu-btn" id="viewMenuBtn">
          <span>☰</span> View Menu
        </button>

        <div class="chat-container">
          <div class="chat-messages" id="chatMessages"></div>
        </div>

        <div class="chat-input-container">
          <input type="text" id="chatInput" placeholder="Type your message..." />
          <button id="sendBtn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="menu-overlay" id="menuOverlay"></div>
      <div class="menu-panel" id="menuPanel">
        <div class="menu-header">
          <h2>Our Menu</h2>
          <button class="close-btn" id="closeMenuBtn">✕</button>
        </div>
        <div class="menu-content" id="menuContent"></div>
      </div>
    </div>
  `;

  var menuData = {
    starters: [
      { name: 'Bruschetta', tags: ['veg'] },
      { name: 'Garden Salad', tags: ['veg', 'vegan', 'gluten-free'] },
      { name: 'Spring Rolls', tags: ['veg', 'spicy'] },
      { name: 'Tomato Soup', tags: ['veg', 'vegan', 'gluten-free'] },
      { name: 'Shrimp Skewers', tags: ['non-veg', 'gluten-free'] },
      { name: 'Paneer Tikka', tags: ['veg', 'spicy', 'gluten-free'] },
      { name: 'Hara Bhara Kebab', tags: ['veg'] },
      { name: 'Chicken 65', tags: ['non-veg', 'spicy'] },
      { name: 'Veg Samosa', tags: ['veg'] },
      { name: 'Fish Fry', tags: ['non-veg'] }
    ],
    mains: [
      { name: 'Grilled Salmon', tags: ['non-veg', 'gluten-free'] },
      { name: 'Margherita Pizza', tags: ['veg'] },
      { name: 'Tofu Stir Fry', tags: ['vegan', 'spicy'] },
      { name: 'Mushroom Risotto', tags: ['veg', 'gluten-free'] },
      { name: 'Grilled Chicken', tags: ['non-veg', 'gluten-free'] },
      { name: 'Lamb Chops', tags: ['non-veg'] },
      { name: 'Butter Chicken', tags: ['non-veg'] },
      { name: 'Paneer Butter Masala', tags: ['veg'] },
      { name: 'Veg Biryani', tags: ['veg', 'gluten-free'] },
      { name: 'Chicken Biryani', tags: ['non-veg', 'gluten-free'] },
      { name: 'Dal Tadka', tags: ['veg'] },
      { name: 'Palak Paneer', tags: ['veg', 'gluten-free'] }
    ],
    desserts: [
      { name: 'Gulab Jamun', tags: ['veg'] },
      { name: 'Rasgulla', tags: ['veg'] },
      { name: 'Chocolate Brownie', tags: ['veg'] },
      { name: 'Ice Cream Sundae', tags: ['veg'] }
    ],
    drinks: [
      { name: 'Masala Chai', tags: ['veg'] },
      { name: 'Cold Coffee', tags: ['veg'] },
      { name: 'Fresh Lime Soda', tags: ['veg'] },
      { name: 'Mango Lassi', tags: ['veg'] }
    ]
  };

  var bookingData = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    people: '',
    dietary: ''
  };

  var currentStep = 0;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function normalizeDate(input) {
    var cleaned = input.trim().replace(/[\/\s\.]/g, '-');
    var parts = cleaned.split('-');

    if (parts.length !== 3) return null;

    var day = parts[0].padStart(2, '0');
    var month = parts[1].padStart(2, '0');
    var year = parts[2].length === 2 ? parts[2] : parts[2].slice(-2);

    var normalized = day + '-' + month + '-' + year;

    var d = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (
      d.getDate() != parseInt(day, 10) ||
      d.getMonth() != parseInt(month, 10) - 1
    ) {
      return null;
    }

    var today = new Date();
    today.setHours(0,0,0,0);
    if (d < today) return null;

    return normalized;
  }
  var editField = '';

  var steps = [
    { key: 'name', question: 'Welcome to Spice & Soul! I will help you reserve a table. May I have your name please?' },
    { key: 'email', question: 'Great! What is your email address?' },
    { key: 'phone', question: 'What is your phone number?' },
    { key: 'date', question: 'What date would you like to reserve? (DD-MM-YY)' },
    { key: 'time', question: 'What time would you like to reserve? ' },
    { key: 'people', question: 'How many people will be joining?' },
    { key: 'dietary', question: 'Any dietary restrictions?' }
  ];

  function addMessage(text, type) {
    var messagesDiv = document.getElementById('chatMessages');

    var wrapper = document.createElement('div');
    wrapper.className = 'message';

    var bubble = document.createElement('div');
    bubble.className = type === 'bot' ? 'bot-message' : 'user-message';
    bubble.innerText = text;

    var avatar = document.createElement('div');
    avatar.className = type === 'bot' ? 'avatar bot' : 'avatar user';

    var img = document.createElement('img');
    img.src = type === 'bot' ? './public/bot.png' : './public/user.png';
    img.alt = type;

    avatar.appendChild(img);

    if (type === 'bot') {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    } else {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    }

    messagesDiv.appendChild(wrapper);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function showNextQuestion() {
    if (currentStep < steps.length) {
      var step = steps[currentStep];
      addMessage(step.question, 'bot');
      if (step.key === 'time') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        var times = ['12:00', '13:00', '18:00', '19:00', '20:00', '21:00'];
        times.forEach(function(t) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = t;
          btn.onclick = function() {
            handleUserInput(t);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      // --- QUICK OPTIONS FOR PEOPLE ---
      if (step.key === 'people') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        var peopleCounts = ['1', '2', '3', '4', '5', '6'];
        peopleCounts.forEach(function(count) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = count;
          btn.onclick = function() {
            handleUserInput(count);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
      // --- QUICK OPTIONS FOR DIETARY ---
      if (step.key === 'dietary') {
        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        var dietaryOptions = ['veg', 'vegan', 'non-veg', 'none'];
        dietaryOptions.forEach(function(option) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = option;
          btn.onclick = function() {
            handleUserInput(option);
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    } else {
      showSummary();
    }
  }

  function showSummary() {
    var summary =
      "📋 Here's your booking summary:\n\n" +
      "👤 Name: " + bookingData.name + "\n" +
      "📧 Email: " + bookingData.email + "\n" +
      "📱 Phone: " + bookingData.phone + "\n" +
      "📅 Date: " + bookingData.date + "\n" +
      "⏰ Time: " + bookingData.time + "\n" +
      "👥 Guests: " + bookingData.people + "\n" +
      "🥗 Diet: " + bookingData.dietary;

    addMessage(summary, 'bot');

    setTimeout(function() {
      addMessage('Is everything correct?', 'bot');

      var messagesDiv = document.getElementById('chatMessages');
      var optionsDiv = document.createElement('div');
      optionsDiv.className = 'quick-options';

      ['Correct', 'Change'].forEach(function(option) {
        var btn = document.createElement('div');
        btn.className = 'quick-option';
        btn.textContent = option;
        btn.onclick = function() {
          handleUserInput(option.toLowerCase());
        };
        optionsDiv.appendChild(btn);
      });

      messagesDiv.appendChild(optionsDiv);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 500);
  }

  function confirmBooking() {
    setTimeout(function() {
      var available = Math.random() > 0.3;

      if (available) {
        var tableNumber = Math.floor(Math.random() * 20) + 1;
        addMessage(
          '✅ Booking confirmed! Table #' + tableNumber +
          ' (seats ' + bookingData.people + ') for ' + bookingData.people +
          ' on ' + bookingData.date + ' at ' + bookingData.time + '.\n\n' +
          '📩 Confirmation details have been sent to ' + bookingData.email +
          ' and ' + bookingData.phone + '.\n\n' +
          '✨ We can’t wait to welcome you, ' + bookingData.name +
          '! See you at Spice & Soul. 🎉',
          'bot'
        );
      } else {
        addMessage('Sorry, no tables are available at that time. Would you like to be added to the waitlist?', 'bot');

        var messagesDiv = document.getElementById('chatMessages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'quick-options';

        ['Yes', 'No'].forEach(function(option) {
          var btn = document.createElement('div');
          btn.className = 'quick-option';
          btn.textContent = option;
          btn.onclick = function() {
            handleUserInput(option.toLowerCase());
          };
          optionsDiv.appendChild(btn);
        });

        messagesDiv.appendChild(optionsDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }, 1000);
  }

  function handleUserInput(input) {
    if (input.trim() === '') {
      return;
    }

    addMessage(input, 'user');

    if (currentStep < steps.length) {
      var step = steps[currentStep];

      if (step.key === 'date') {
        var normalized = normalizeDate(input);
        if (!normalized) {
          addMessage(
            'Please enter a valid date like 12-05-26, 12/5/26, or 12 5 26.',
            'bot'
          );
          return;
        }
        input = normalized;
      }

      if (step.key === 'email' && !isValidEmail(input)) {
        addMessage('That doesn’t look like a valid email. Please try again (e.g., name@example.com).', 'bot');
        return;
      }
      if (step.key === 'phone' && !isValidPhone(input)) {
        addMessage('Please enter a valid 10-digit phone number.', 'bot');
        return;
      }
      if (step.key === 'people') {
        var count = parseInt(input, 10);
        if (isNaN(count) || count < 1 || count > 6) {
          addMessage('We currently support reservations for 1–6 guests.', 'bot');
          return;
        }
      }
      if (step.key === 'dietary') {
        var allowed = ['veg','vegan','non-veg','none'];
        if (!allowed.includes(input.toLowerCase())) {
          addMessage('Please choose from veg / vegan / non-veg / none.', 'bot');
          return;
        }
      }

      bookingData[step.key] = input;
      currentStep = currentStep + 1;

      setTimeout(function() {
        showNextQuestion();
      }, 500);
    } else {
      var lowerInput = input.toLowerCase();

      if (lowerInput === 'yes' || lowerInput === 'correct' || lowerInput === 'confirm') {
        confirmBooking();
      } else if (lowerInput === 'no' || lowerInput.includes('change') || lowerInput.includes('edit')) {
        setTimeout(function() {
          addMessage('What would you like to change?', 'bot');

          var messagesDiv = document.getElementById('chatMessages');
          var optionsDiv = document.createElement('div');
          optionsDiv.className = 'quick-options';

          var fields = ['name', 'email', 'phone', 'date', 'time', 'people', 'dietary'];
          fields.forEach(function(field) {
            var btn = document.createElement('div');
            btn.className = 'quick-option';
            btn.textContent = field;
            btn.onclick = function() {
              handleUserInput(field);
            };
            optionsDiv.appendChild(btn);
          });

          messagesDiv.appendChild(optionsDiv);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 500);

        editField = 'waiting';
      } else if (editField === 'waiting') {
        if (lowerInput === 'name' || lowerInput === 'email' || lowerInput === 'phone' || lowerInput === 'date' || lowerInput === 'time' || lowerInput === 'people' || lowerInput === 'dietary') {
          editField = lowerInput;
          setTimeout(function() {
            addMessage('Please provide the new ' + editField + ':', 'bot');
          }, 500);
        } else {
          setTimeout(function() {
            addMessage('Please specify: name / email / phone / date / time / people / dietary', 'bot');
          }, 500);
        }
      } else if (editField !== '' && editField !== 'waiting') {
        bookingData[editField] = input;
        var changedField = editField;
        editField = '';

        setTimeout(function() {
          addMessage('Updated ' + changedField + ' 👍', 'bot');

          // Show quick options again if applicable
          if (changedField === 'dietary') {
            addMessage('Any dietary restrictions?', 'bot');

            var messagesDiv = document.getElementById('chatMessages');
            var optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';

            ['veg', 'vegan', 'non-veg', 'none'].forEach(function(option) {
              var btn = document.createElement('div');
              btn.className = 'quick-option';
              btn.textContent = option;
              btn.onclick = function() {
                handleUserInput(option);
              };
              optionsDiv.appendChild(btn);
            });

            messagesDiv.appendChild(optionsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          } 
          else if (changedField === 'people') {
            addMessage('How many people will be joining?', 'bot');

            var messagesDiv = document.getElementById('chatMessages');
            var optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';

            ['1','2','3','4','5','6'].forEach(function(count) {
              var btn = document.createElement('div');
              btn.className = 'quick-option';
              btn.textContent = count;
              btn.onclick = function() {
                handleUserInput(count);
              };
              optionsDiv.appendChild(btn);
            });

            messagesDiv.appendChild(optionsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          } 
          else if (changedField === 'time') {
            addMessage('What time works for you?', 'bot');

            var messagesDiv = document.getElementById('chatMessages');
            var optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';

            ['12:00','13:00','18:00','19:00','20:00','21:00'].forEach(function(t) {
              var btn = document.createElement('div');
              btn.className = 'quick-option';
              btn.textContent = t;
              btn.onclick = function() {
                handleUserInput(t);
              };
              optionsDiv.appendChild(btn);
            });

            messagesDiv.appendChild(optionsDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          } 
          else {
            showSummary();
          }
        }, 500);
      } else if (lowerInput === 'yes') {
        setTimeout(function() {
          addMessage('✅ You’ve been added to the waitlist. We’ll notify you as soon as a table becomes available.', 'bot');
        }, 500);
      } else if (lowerInput === 'no') {
        setTimeout(function() {
          addMessage('No problem 😊 You can try a different date, time, or party size.', 'bot');
        }, 500);
      } else {
        setTimeout(function() {
          addMessage('Please answer yes or no, or type "change" to edit your details.', 'bot');
        }, 500);
      }
    }
  }

  function sendMessage() {
    var input = document.getElementById('chatInput');
    var message = input.value;
    handleUserInput(message);
    input.value = '';
  }

  function renderMenu() {
    var menuContent = document.getElementById('menuContent');
    menuContent.innerHTML = '';

    var startersSection = document.createElement('div');
    startersSection.className = 'menu-section';
    var startersTitle = document.createElement('h3');
    startersTitle.textContent = 'Starters';
    startersSection.appendChild(startersTitle);

    for (var i = 0; i < menuData.starters.length; i++) {
      var item = menuData.starters[i];
      var itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';

      var itemInfo = document.createElement('div');
      itemInfo.className = 'item-info';

      var itemName = document.createElement('div');
      itemName.className = 'item-name';
      itemName.textContent = item.name;
      itemInfo.appendChild(itemName);

      var itemTags = document.createElement('div');
      itemTags.className = 'item-tags';
      for (var j = 0; j < item.tags.length; j++) {
        var tag = document.createElement('span');
        tag.className = 'tag ' + item.tags[j];
        tag.textContent = item.tags[j];
        itemTags.appendChild(tag);
      }
      itemInfo.appendChild(itemTags);

      itemDiv.appendChild(itemInfo);
      startersSection.appendChild(itemDiv);
    }

    menuContent.appendChild(startersSection);

    var mainsSection = document.createElement('div');
    mainsSection.className = 'menu-section';
    var mainsTitle = document.createElement('h3');
    mainsTitle.textContent = 'Main Courses';
    mainsSection.appendChild(mainsTitle);

    for (var i = 0; i < menuData.mains.length; i++) {
      var item = menuData.mains[i];
      var itemDiv = document.createElement('div');
      itemDiv.className = 'menu-item';

      var itemInfo = document.createElement('div');
      itemInfo.className = 'item-info';

      var itemName = document.createElement('div');
      itemName.className = 'item-name';
      itemName.textContent = item.name;
      itemInfo.appendChild(itemName);

      var itemTags = document.createElement('div');
      itemTags.className = 'item-tags';
      for (var j = 0; j < item.tags.length; j++) {
        var tag = document.createElement('span');
        tag.className = 'tag ' + item.tags[j];
        tag.textContent = item.tags[j];
        itemTags.appendChild(tag);
      }
      itemInfo.appendChild(itemTags);

      itemDiv.appendChild(itemInfo);
      mainsSection.appendChild(itemDiv);
    }

    menuContent.appendChild(mainsSection);

    // Render desserts and drinks sections
    function renderSection(title, items) {
      var section = document.createElement('div');
      section.className = 'menu-section';

      var h = document.createElement('h3');
      h.textContent = title;
      section.appendChild(h);

      items.forEach(function(item) {
        var itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';

        var itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';

        var itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.name;
        itemInfo.appendChild(itemName);

        var itemTags = document.createElement('div');
        itemTags.className = 'item-tags';
        item.tags.forEach(function(t) {
          var tag = document.createElement('span');
          tag.className = 'tag ' + t;
          tag.textContent = t;
          itemTags.appendChild(tag);
        });
        itemInfo.appendChild(itemTags);

        itemDiv.appendChild(itemInfo);
        section.appendChild(itemDiv);
      });

      return section;
    }

    menuContent.appendChild(renderSection('Desserts', menuData.desserts));
    menuContent.appendChild(renderSection('Drinks', menuData.drinks));
  }

  document.getElementById('sendBtn').addEventListener('click', sendMessage);

  document.getElementById('chatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  document.getElementById('viewMenuBtn').addEventListener('click', function() {
    document.getElementById('menuOverlay').classList.add('active');
    document.getElementById('menuPanel').classList.add('active');
  });

  document.getElementById('closeMenuBtn').addEventListener('click', function() {
    document.getElementById('menuOverlay').classList.remove('active');
    document.getElementById('menuPanel').classList.remove('active');
  });

  document.getElementById('menuOverlay').addEventListener('click', function() {
    document.getElementById('menuOverlay').classList.remove('active');
    document.getElementById('menuPanel').classList.remove('active');
  });

  renderMenu();
  showNextQuestion();
});