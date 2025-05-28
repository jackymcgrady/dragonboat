const questions = [
    {
        id: 1,
        title: "龙的造型",
        options: ["🐣 迷你 Q 版龙", "🐲 中国长龙", "🔥 西方喷火龙", "🤖 未来机器人龙", "🌊 水中海蛇龙", "🦖 恐龙混合龙", "🧸 长毛毛绒龙"]
    },
    {
        id: 2,
        title: "主色调",
        options: ["🔴 热情红橙系", "💠 清凉蓝绿系", "💜 梦幻紫粉系", "✨ 闪耀金属系", "🌅 夕阳金黄系", "🌈 霓虹彩虹系"]
    },
    {
        id: 3,
        title: "身体纹理",
        options: ["🐠 经典鱼鳞", "🐯 条纹虎纹", "🎨 五彩斑点", "🪞 光滑无纹", "⭐ 魔法星星纹", "💎 立体几何块"]
    },
    {
        id: 4,
        title: "头角样式",
        options: ["🥚 无角光溜溜", "🦄 独角兽尖角", "🐏 弯曲山羊角", "🦌 树枝鹿角", "❄️ 冰晶锥角", "⚡ 闪电锯齿角"]
    },
    {
        id: 5,
        title: "尾巴末端",
        options: ["🎯 箭头尖", "🪄 星形魔杖", "🐟 鱼鳍形", "🔥 火焰形", "💎 钻石锤头", "🌸 叶片扇形"]
    },
    {
        id: 6,
        title: "表情／情绪",
        options: ["🥰 可爱", "😏 傲娇", "😴 慵懒", "😠 凶狠", "😉 眨眼", "😈 坏笑"]
    },
    {
        id: 7,
        title: "元素能力",
        options: ["🔥 火焰喷射", "❄️ 水／冰吐息", "⚡ 闪电电光", "🌿 植物藤蔓", "🎵 音波震荡", "🌈 彩虹光束"]
    },
    {
        id: 8,
        title: "装饰品",
        options: ["🛡️ 铠甲护甲", "💎 珠宝项链", "🌺 花环藤蔓", "🎨 彩绘纹身", "🥽 科技护目镜", "🎀 丝带蝴蝶结"]
    },
    {
        id: 9,
        title: "背景场景",
        options: ["☁️ 云端天空", "🏔️ 山洞宝藏", "🌊 海底世界", "🌳 魔法森林", "🌌 太空星河", "🌅 彩霞日落"]
    },
    {
        id: 10,
        title: "龙舟上的 2 个人物",
        options: ["🥁 鼓手哥哥 + 划桨妹妹", "👘 汉服少年 + 少女", "🐰 两个随机小动物", "🤖 机器人 + 小学生", "🏴‍☠️ 海盗船长 + 水手", "🧙‍♂️ 魔法学院学生"]
    }
];

let currentQuestionIndex = 0;
const userAnswers = [];

// Generate a unique user ID
const userId = Date.now().toString(36) + Math.random().toString(36).substr(2);

// Update active users count periodically
function updateActiveUsers() {
    fetch('/active-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector('.active-users-count').textContent = data.active_users;
    })
    .catch(console.error);
}

// Update active users every 30 seconds
setInterval(updateActiveUsers, 30000);
updateActiveUsers(); // Initial update

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function addIngredient(questionId, answer) {
    const ingredientsList = document.getElementById('ingredients-list');
    const [emoji, text] = answer.split(' ');
    const question = questions.find(q => q.id === questionId);
    
    const ingredientItem = document.createElement('div');
    ingredientItem.className = 'ingredient-item';
    ingredientItem.innerHTML = `
        <span class="ingredient-emoji">${emoji}</span>
        <span class="ingredient-text">${question.title}: ${text}</span>
    `;
    
    ingredientsList.appendChild(ingredientItem);
}

function clearIngredients() {
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
}

// Show start-over button immediately when page loads
document.getElementById('start-over').style.display = 'flex';

function displayQuestion(index) {
    updateProgressBar();
    const questionContainer = document.getElementById('question-container');
    const questionContent = questionContainer.querySelector('.question');

    // Fade out existing question first
    if (questionContent) {
        questionContainer.classList.remove('fade-in');
        questionContainer.classList.add('fade-out');
    }

    // After fade out (or immediately if no previous question)
    setTimeout(() => {
        if (index >= questions.length) {
            // Construct the prompt
            const systemPrompt = `Create an simple image of a dragon boat, which fits all the requirements that the user has chosen. The end product should be simple and suitable for a elementary schooler to copy, with vibrant colors. Make it flat. Generate a square PNG image with a transparent background, where the subject is fully within a circular frame centered in the image. The area outside the circle should be fully transparent.`;
            let userPrompt = "帮我画一条龙舟，给我临摹，我是一个小学生。";
            
            // Helper function to get answer text without the number prefix
            const getAnswerText = (id) => {
                const answer = userAnswers.find(ans => ans.questionId === id)?.answer || "";
                return answer.split('）')[1] || answer.split(')')[1] || answer;
            };

            // Build the complete prompt with all characteristics
            userPrompt += `龙舟的造型是${getAnswerText(1)}, `;
            userPrompt += `主色调是${getAnswerText(2)}, `;
            userPrompt += `身体纹理是${getAnswerText(3)}, `;
            userPrompt += `头角样式是${getAnswerText(4)}, `;
            userPrompt += `尾巴末端是${getAnswerText(5)}, `;
            userPrompt += `表情是${getAnswerText(6)}, `;
            userPrompt += `具有的元素魔法能力是${getAnswerText(7)}, `;
            userPrompt += `身上有${getAnswerText(8)}作为装饰品，`;
            userPrompt += `背景场景是${getAnswerText(9)}, `;
            userPrompt += `龙舟上有${getAnswerText(10)}`;

            questionContainer.innerHTML = `
                <div class="completion-screen">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <div class="status-and-countdown">
                            <p id="status-message">正在创作你的龙舟...</p>
                            <div class="countdown" id="countdown">30</div>
                        </div>
                        <div class="dragon-animation">🐉</div> 
                    </div>
                    <div id="image-container" class="image-result"></div>
                    <h2>创作完成！</h2>
                    <p>你的选择：</p>
                    <ul class="choices-list">
                        ${userAnswers.map(ans => {
                            const [emoji, text] = ans.answer.split(' ');
                            return `
                                <li>
                                    <span class="option-emoji">${emoji}</span>
                                    <strong>${questions.find(q => q.id === ans.questionId).title}:</strong>
                                    <span class="option-text">${text}</span>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            `;

            // Start countdown and dragon animation
            let countdown = 30;
            const countdownElement = document.getElementById('countdown');
            const dragonElement = document.querySelector('.dragon-animation');
            
            // Show and animate dragon
            dragonElement.classList.add('visible');
            
            const countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    dragonElement.classList.remove('visible');
                }
            }, 1000);

            // Send request to backend
            fetch('/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    system_prompt: systemPrompt,
                    user_prompt: userPrompt,
                    userId: userId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    clearInterval(countdownInterval);
                    dragonElement.classList.remove('visible');
                    
                    const imageContainer = document.getElementById('image-container');
                    const loadingContainer = document.querySelector('.loading-container');
                    
                    const img = document.createElement('img');
                    img.src = data.image_url;
                    img.alt = "生成的龙舟图片";
                    img.className = "generated-image";
                    
                    imageContainer.appendChild(img);
                    loadingContainer.style.display = 'none';
                    
                    // Update active users count
                    document.querySelector('.active-users-count').textContent = data.active_users;
                } else {
                    throw new Error(data.message || '生成图片失败');
                }
            })
            .catch(error => {
                clearInterval(countdownInterval);
                dragonElement.classList.remove('visible');
                const statusMessage = document.getElementById('status-message');
                statusMessage.innerHTML = `错误: ${error.message}`;
                statusMessage.classList.add('error');
            });

            questionContainer.classList.remove('fade-out');
            questionContainer.classList.add('fade-in');
            return;
        }

        const q = questions[index];
        questionContainer.innerHTML = `
            <div class="question">
                <div class="question-header">
                    <span class="question-number">${q.id}/10</span>
                    <h2>${q.title}</h2>
                </div>
                <div class="options-grid">
                    ${q.options.map((opt, optIndex) => {
                        const [emoji, text] = opt.split(' ');
                        return `
                            <button class="option-button" data-option-index="${optIndex}">
                                <span class="option-emoji">${emoji}</span>
                                <span class="option-text">${text}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Add event listeners to new buttons
        document.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', () => {
                const answer = q.options[button.dataset.optionIndex];
                userAnswers.push({
                    questionId: q.id,
                    answer: answer
                });
                addIngredient(q.id, answer);
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex);
            });
        });

        // Fade in new question
        questionContainer.classList.remove('fade-out');
        questionContainer.classList.add('fade-in');
    }, questionContent ? 500 : 0);
}

// Start the questionnaire
displayQuestion(currentQuestionIndex);

// Add start over functionality
document.getElementById('start-over').addEventListener('click', () => {
    currentQuestionIndex = 0;
    userAnswers.length = 0;
    updateProgressBar();
    clearIngredients();
    displayQuestion(currentQuestionIndex);
}); 