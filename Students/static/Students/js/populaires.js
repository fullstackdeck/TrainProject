// ========================================
        // APPLICATION STATE MANAGEMENT
        // ========================================
        console.log("Populaires.js loaded");
        class AppState {
            constructor() {
                this.currentUser = null;
                this.currentPage = 'home';
                this.courses = this.initializeCourses();
                this.userCourses = new Map(); // courseId -> progress data
                this.init();
            }

            init() {
                this.setupDarkMode();
                this.loadUserData();
                this.setupEventListeners();
                this.showPage('home');
            }

            setupDarkMode() {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                }
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                    if (event.matches) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                });
            }

            initializeCourses() {
                return [
                    {
                        id: 1,
                        title: "Introduction au JavaScript",
                        description: "Apprenez les bases du JavaScript moderne avec des exemples pratiques et des projets concrets.",
                        category: "programmation",
                        instructor: "Marie Dubois",
                        duration: "8 heures",
                        level: "Débutant",
                        rating: 4.8,
                        students: 1250,
                        price: "49€",
                        thumbnail: "https://via.placeholder.com/300x200/5D5CDE/white?text=JavaScript",
                        chapters: [
                            { id: 1, title: "Introduction et configuration", duration: "15 min", completed: false },
                            { id: 2, title: "Variables et types de données", duration: "25 min", completed: false },
                            { id: 3, title: "Fonctions et portée", duration: "30 min", completed: false },
                            { id: 4, title: "Objets et tableaux", duration: "35 min", completed: false },
                            { id: 5, title: "DOM et événements", duration: "40 min", completed: false },
                            { id: 6, title: "Projet final", duration: "45 min", completed: false }
                        ]
                    },
                    {
                        id: 2,
                        title: "Design UX/UI Moderne",
                        description: "Maîtrisez les principes du design d'interface utilisateur et créez des expériences exceptionnelles.",
                        category: "design",
                        instructor: "Pierre Martin",
                        duration: "12 heures",
                        level: "Intermédiaire",
                        rating: 4.9,
                        students: 890,
                        price: "79€",
                        thumbnail: "https://via.placeholder.com/300x200/FF6B6B/white?text=UX%2FUI",
                        chapters: [
                            { id: 1, title: "Principes de base du design", duration: "20 min", completed: false },
                            { id: 2, title: "Recherche utilisateur", duration: "30 min", completed: false },
                            { id: 3, title: "Wireframing et prototypage", duration: "45 min", completed: false },
                            { id: 4, title: "Design visuel", duration: "60 min", completed: false },
                            { id: 5, title: "Tests utilisateur", duration: "25 min", completed: false }
                        ]
                    },
                    {
                        id: 3,
                        title: "Marketing Digital",
                        description: "Développez vos compétences en marketing numérique et augmentez votre visibilité en ligne.",
                        category: "marketing",
                        instructor: "Sophie Laurent",
                        duration: "10 heures",
                        level: "Tous niveaux",
                        rating: 4.7,
                        students: 2100,
                        price: "59€",
                        thumbnail: "https://via.placeholder.com/300x200/4ECDC4/white?text=Marketing",
                        chapters: [
                            { id: 1, title: "Stratégie marketing digital", duration: "30 min", completed: false },
                            { id: 2, title: "Réseaux sociaux", duration: "40 min", completed: false },
                            { id: 3, title: "SEO et référencement", duration: "50 min", completed: false },
                            { id: 4, title: "Publicité en ligne", duration: "35 min", completed: false }
                        ]
                    },
                    {
                        id: 4,
                        title: "Gestion de Projet Agile",
                        description: "Apprenez les méthodes agiles pour gérer efficacement vos projets et équipes.",
                        category: "business",
                        instructor: "Thomas Rousseau",
                        duration: "6 heures",
                        level: "Intermédiaire",
                        rating: 4.6,
                        students: 750,
                        price: "39€",
                        thumbnail: "https://via.placeholder.com/300x200/45B7D1/white?text=Agile",
                        chapters: [
                            { id: 1, title: "Introduction à l'agilité", duration: "20 min", completed: false },
                            { id: 2, title: "Scrum framework", duration: "40 min", completed: false },
                            { id: 3, title: "Planification et estimation", duration: "30 min", completed: false },
                            { id: 4, title: "Outils et bonnes pratiques", duration: "25 min", completed: false }
                        ]
                    }
                ];
            }

            loadUserData() {
                // Simulate loading user data from storage
                const userData = localStorage.getItem('currentUser');
                if (userData) {
                    this.currentUser = JSON.parse(userData);
                    this.loadUserCourses();
                    this.updateUI();
                }
            }

            loadUserCourses() {
                const userCoursesData = localStorage.getItem(`userCourses_${this.currentUser.id}`);
                if (userCoursesData) {
                    const coursesArray = JSON.parse(userCoursesData);
                    this.userCourses = new Map(coursesArray);
                }
            }

            saveUserData() {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                if (this.currentUser) {
                    localStorage.setItem(`userCourses_${this.currentUser.id}`, JSON.stringify([...this.userCourses]));
                }
            }

            login(email, password, name = null) {
                // Simulate authentication
                const user = {
                    id: Date.now(),
                    email: email,
                    name: name || email.split('@')[0],
                    joinDate: new Date().toISOString()
                };
                
                this.currentUser = user;
                this.saveUserData();
                this.updateUI();
                this.showPage('dashboard');
                return true;
            }

            logout() {
                this.currentUser = null;
                this.userCourses.clear();
                localStorage.removeItem('currentUser');
                this.updateUI();
                this.showPage('home');
            }

            enrollInCourse(courseId) {
                if (!this.currentUser) {
                    this.showPage('auth');
                    return;
                }

                if (!this.userCourses.has(courseId)) {
                    this.userCourses.set(courseId, {
                        enrolledAt: new Date().toISOString(),
                        progress: 0,
                        completedChapters: [],
                        currentChapter: 1
                    });
                    this.saveUserData();
                    this.updateUI();
                }
            }

            updateChapterProgress(courseId, chapterId) {
                if (!this.userCourses.has(courseId)) return;

                const courseProgress = this.userCourses.get(courseId);
                if (!courseProgress.completedChapters.includes(chapterId)) {
                    courseProgress.completedChapters.push(chapterId);
                    
                    const course = this.courses.find(c => c.id === courseId);
                    if (course) {
                        courseProgress.progress = (courseProgress.completedChapters.length / course.chapters.length) * 100;
                    }
                    
                    this.saveUserData();
                    this.updateUI();
                }
            }

            setupEventListeners() {
                // Navigation
                document.getElementById('login-btn').addEventListener('click', () => this.showAuth('login'));
                document.getElementById('register-btn').addEventListener('click', () => this.showAuth('register'));
                document.getElementById('cta-register').addEventListener('click', () => this.showAuth('register'));
                document.getElementById('logout-btn').addEventListener('click', () => this.logout());
                document.getElementById('browse-courses-btn').addEventListener('click', () => this.showPage('courses'));

                // Auth form
                document.getElementById('auth-form').addEventListener('submit', (e) => this.handleAuth(e));
                document.getElementById('auth-switch').addEventListener('click', () => this.toggleAuthMode());

                // Search and filter
                document.getElementById('course-search').addEventListener('input', (e) => this.filterCourses());
                document.getElementById('category-filter').addEventListener('change', (e) => this.filterCourses());
            }

            showPage(pageId) {
                // Hide all pages
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.add('hidden');
                });

                // Show target page
                const targetPage = document.getElementById(`${pageId}-page`);
                if (targetPage) {
                    targetPage.classList.remove('hidden');
                    targetPage.classList.add('fade-in');
                }

                this.currentPage = pageId;
                this.updatePageContent(pageId);
                this.updateNavigation();
            }

            showAuth(mode) {
                const isLogin = mode === 'login';
                document.getElementById('auth-title').textContent = isLogin ? 'Connexion' : 'Inscription';
                document.getElementById('auth-submit-text').textContent = isLogin ? 'Se connecter' : 'S\'inscrire';
                document.getElementById('auth-switch').textContent = isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter';
                document.getElementById('name-field').classList.toggle('hidden', isLogin);
                document.getElementById('auth-form').dataset.mode = mode;
                this.showPage('auth');
            }

            toggleAuthMode() {
                const currentMode = document.getElementById('auth-form').dataset.mode;
                this.showAuth(currentMode === 'login' ? 'register' : 'login');
            }

            handleAuth(e) {
                e.preventDefault();
                const form = e.target;
                const mode = form.dataset.mode;
                const email = form.email.value;
                const password = form.password.value;
                const name = mode === 'register' ? form.name.value : null;

                if (this.login(email, password, name)) {
                    form.reset();
                }
            }

            updateUI() {
                this.updateNavigation();
                this.updateDashboard();
            }

            updateNavigation() {
                const userMenu = document.getElementById('user-menu');
                const authButtons = document.getElementById('auth-buttons');
                const navMenu = document.getElementById('nav-menu');

                if (this.currentUser) {
                    userMenu.classList.remove('hidden');
                    authButtons.classList.add('hidden');
                    document.getElementById('user-name').textContent = this.currentUser.name;
                    
                    navMenu.innerHTML = `
                        <a href="#" class="nav-link px-3 py-2 text-sm font-medium ${this.currentPage === 'dashboard' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}" data-page="dashboard">
                            <i class="fas fa-tachometer-alt mr-2"></i>Tableau de bord
                        </a>
                        <a href="#" class="nav-link px-3 py-2 text-sm font-medium ${this.currentPage === 'courses' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}" data-page="courses">
                            <i class="fas fa-book mr-2"></i>Cours
                        </a>
                    `;
                } else {
                    userMenu.classList.add('hidden');
                    authButtons.classList.remove('hidden');
                    navMenu.innerHTML = `
                        <a href="#" class="nav-link px-3 py-2 text-sm font-medium ${this.currentPage === 'home' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}" data-page="home">
                            Accueil
                        </a>
                        <a href="#" class="nav-link px-3 py-2 text-sm font-medium ${this.currentPage === 'courses' ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'}" data-page="courses">
                            Cours
                        </a>
                    `;
                }

                // Add click listeners to nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const page = link.dataset.page;
                        if (page) {
                            this.showPage(page);
                        }
                    });
                });
            }

            updatePageContent(pageId) {
                switch(pageId) {
                    case 'home':
                        this.renderFeaturedCourses();
                        break;
                    case 'dashboard':
                        this.updateDashboard();
                        break;
                    case 'courses':
                        this.renderAllCourses();
                        break;
                }
            }

            renderFeaturedCourses() {
                const container = document.getElementById('featured-courses');
                const featuredCourses = this.courses.slice(0, 3);
                
                container.innerHTML = featuredCourses.map(course => this.createCourseCard(course, false)).join('');
            }

            renderAllCourses() {
                const container = document.getElementById('all-courses');
                container.innerHTML = this.courses.map(course => this.createCourseCard(course, true)).join('');
            }

            createCourseCard(course, showEnrollButton = true) {
                const isEnrolled = this.userCourses.has(course.id);
                const progress = isEnrolled ? this.userCourses.get(course.id).progress : 0;

                return `
                    <div class="course-card bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="aspect-video bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <div class="text-white text-center">
                                <i class="fas fa-play-circle text-4xl mb-2"></i>
                                <p class="font-semibold">${course.title}</p>
                            </div>
                        </div>
                        <div class="p-6">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-lg font-semibold line-clamp-2">${course.title}</h3>
                                <span class="text-lg font-bold text-primary">${course.price}</span>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">${course.description}</p>
                            
                            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <span><i class="fas fa-user mr-1"></i>${course.instructor}</span>
                                <span><i class="fas fa-clock mr-1"></i>${course.duration}</span>
                            </div>

                            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <span><i class="fas fa-star mr-1 text-yellow-400"></i>${course.rating}</span>
                                <span><i class="fas fa-users mr-1"></i>${course.students} étudiants</span>
                            </div>

                            ${isEnrolled ? `
                                <div class="mb-4">
                                    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        <span>Progression</span>
                                        <span>${Math.round(progress)}%</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div class="bg-primary h-2 rounded-full progress-bar" style="width: ${progress}%"></div>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="app.continueCourse(${course.id})" class="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm font-medium">
                                        Continuer
                                    </button>
                                    <button onclick="app.showCourseDetail(${course.id})" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                                        Détails
                                    </button>
                                </div>
                            ` : showEnrollButton ? `
                                <div class="flex space-x-2">
                                    <button onclick="app.enrollInCourse(${course.id})" class="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm font-medium">
                                        S'inscrire
                                    </button>
                                    <button onclick="app.showCourseDetail(${course.id})" class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                                        Aperçu
                                    </button>
                                </div>
                            ` : `
                                <button onclick="app.showCourseDetail(${course.id})" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                                    Voir le cours
                                </button>
                            `}
                        </div>
                    </div>
                `;
            }

            updateDashboard() {
                if (!this.currentUser) return;

                const enrolledCourses = [...this.userCourses.keys()].map(id => ({
                    ...this.courses.find(c => c.id === id),
                    progress: this.userCourses.get(id)
                })).filter(c => c.id);

                const completedCourses = enrolledCourses.filter(c => c.progress.progress === 100);
                const totalHours = enrolledCourses.reduce((sum, course) => {
                    const hours = parseInt(course.duration) || 0;
                    return sum + (hours * (course.progress.progress / 100));
                }, 0);

                document.getElementById('active-courses-count').textContent = enrolledCourses.length;
                document.getElementById('completed-courses-count').textContent = completedCourses.length;
                document.getElementById('study-hours').textContent = `${Math.round(totalHours)}h`;

                const myCoursesContainer = document.getElementById('my-courses');
                if (enrolledCourses.length === 0) {
                    myCoursesContainer.innerHTML = `
                        <div class="col-span-full text-center py-12">
                            <i class="fas fa-book-open text-4xl text-gray-400 mb-4"></i>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun cours inscrit</h3>
                            <p class="text-gray-500 dark:text-gray-400 mb-4">Commencez votre apprentissage en vous inscrivant à un cours</p>
                            <button onclick="app.showPage('courses')" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                                Parcourir les cours
                            </button>
                        </div>
                    `;
                } else {
                    myCoursesContainer.innerHTML = enrolledCourses.map(course => this.createCourseCard(course, false)).join('');
                }
            }

            showCourseDetail(courseId) {
                const course = this.courses.find(c => c.id === courseId);
                if (!course) return;

                const isEnrolled = this.userCourses.has(courseId);
                const progress = isEnrolled ? this.userCourses.get(courseId) : null;

                // Update course header
                document.getElementById('course-header').innerHTML = `
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div class="flex-1">
                                <h1 class="text-3xl font-bold mb-2">${course.title}</h1>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">${course.description}</p>
                                <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span><i class="fas fa-user mr-1"></i>${course.instructor}</span>
                                    <span><i class="fas fa-clock mr-1"></i>${course.duration}</span>
                                    <span><i class="fas fa-signal mr-1"></i>${course.level}</span>
                                    <span><i class="fas fa-star mr-1 text-yellow-400"></i>${course.rating}</span>
                                    <span><i class="fas fa-users mr-1"></i>${course.students} étudiants</span>
                                </div>
                            </div>
                            <div class="mt-4 md:mt-0 md:ml-6">
                                <div class="text-right">
                                    <div class="text-3xl font-bold text-primary mb-2">${course.price}</div>
                                    ${isEnrolled ? `
                                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            Progression: ${Math.round(progress.progress)}%
                                        </div>
                                        <div class="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                                            <div class="bg-primary h-2 rounded-full progress-bar" style="width: ${progress.progress}%"></div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Update course description
                document.getElementById('course-description').innerHTML = `
                    <p class="mb-4">${course.description}</p>
                    <h4 class="font-semibold mb-2">Ce que vous apprendrez :</h4>
                    <ul class="list-disc list-inside space-y-1 text-sm">
                        <li>Les concepts fondamentaux de ${course.title.toLowerCase()}</li>
                        <li>Les meilleures pratiques et techniques avancées</li>
                        <li>Projets pratiques pour mettre en application vos connaissances</li>
                        <li>Conseils d'expert de ${course.instructor}</li>
                    </ul>
                `;

                // Update course actions
                document.getElementById('course-actions').innerHTML = isEnrolled ? `
                    <button onclick="app.continueCourse(${courseId})" class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark mb-3">
                        Continuer le cours
                    </button>
                    <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Inscrit le ${new Date(progress.enrolledAt).toLocaleDateString('fr-FR')}
                    </div>
                ` : `
                    <button onclick="app.enrollInCourse(${courseId})" class="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark mb-3">
                        S'inscrire au cours
                    </button>
                    <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
                        ${course.students} étudiants inscrits
                    </div>
                `;

                // Update chapters list
                document.getElementById('course-chapters').innerHTML = course.chapters.map((chapter, index) => {
                    const isCompleted = isEnrolled && progress.completedChapters.includes(chapter.id);
                    const isCurrent = isEnrolled && progress.currentChapter === chapter.id;
                    
                    return `
                        <div class="chapter-item flex items-center p-3 rounded-md ${isCurrent ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} cursor-pointer" onclick="app.playChapter(${courseId}, ${chapter.id})">
                            <div class="flex-shrink-0 mr-3">
                                ${isCompleted ? 
                                    '<i class="fas fa-check-circle text-green-500"></i>' :
                                    `<span class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">${index + 1}</span>`
                                }
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate">${chapter.title}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">${chapter.duration}</p>
                            </div>
                            ${isCurrent ? '<i class="fas fa-play text-primary text-sm"></i>' : ''}
                        </div>
                    `;
                }).join('');

                this.showPage('course-detail');
            }

            continueCourse(courseId) {
                const progress = this.userCourses.get(courseId);
                if (progress) {
                    this.playChapter(courseId, progress.currentChapter);
                }
            }

            playChapter(courseId, chapterId) {
                const course = this.courses.find(c => c.id === courseId);
                const chapter = course.chapters.find(c => c.id === chapterId);
                
                if (!course || !chapter) return;

                // Update current chapter in progress
                if (this.userCourses.has(courseId)) {
                    const progress = this.userCourses.get(courseId);
                    progress.currentChapter = chapterId;
                    this.saveUserData();
                }

                // Update player UI
                document.getElementById('current-chapter-title').textContent = chapter.title;
                document.getElementById('current-chapter-description').textContent = `Chapitre ${chapterId} - ${chapter.duration}`;
                document.getElementById('player-course-title').textContent = course.title;

                // Update progress
                const courseProgress = this.userCourses.get(courseId);
                if (courseProgress) {
                    document.getElementById('course-progress-text').textContent = `${Math.round(courseProgress.progress)}%`;
                    document.getElementById('course-progress-bar').style.width = `${courseProgress.progress}%`;
                }

                // Update chapter playlist
                document.getElementById('chapter-playlist').innerHTML = course.chapters.map((ch, index) => {
                    const isCompleted = courseProgress && courseProgress.completedChapters.includes(ch.id);
                    const isCurrent = ch.id === chapterId;
                    
                    return `
                        <div class="chapter-item flex items-center p-3 border-b border-gray-200 dark:border-gray-700 ${isCurrent ? 'bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} cursor-pointer" onclick="app.playChapter(${courseId}, ${ch.id})">
                            <div class="flex-shrink-0 mr-3">
                                ${isCompleted ? 
                                    '<i class="fas fa-check-circle text-green-500"></i>' :
                                    isCurrent ?
                                    '<i class="fas fa-play text-primary"></i>' :
                                    `<span class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">${index + 1}</span>`
                                }
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate">${ch.title}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">${ch.duration}</p>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add complete chapter button to video player
                document.getElementById('video-player').innerHTML = `
                    <div class="text-white text-center">
                        <i class="fas fa-play-circle text-6xl mb-4"></i>
                        <p class="text-lg mb-2">Lecteur vidéo</p>
                        <p class="text-sm text-gray-300 mb-6">${chapter.title}</p>
                        <button onclick="app.completeChapter(${courseId}, ${chapterId})" class="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                            Marquer comme terminé
                        </button>
                    </div>
                `;

                this.showPage('course-player');
            }

            completeChapter(courseId, chapterId) {
                this.updateChapterProgress(courseId, chapterId);
                
                // Find next chapter
                const course = this.courses.find(c => c.id === courseId);
                const currentIndex = course.chapters.findIndex(c => c.id === chapterId);
                
                if (currentIndex < course.chapters.length - 1) {
                    const nextChapter = course.chapters[currentIndex + 1];
                    setTimeout(() => {
                        this.playChapter(courseId, nextChapter.id);
                    }, 1000);
                } else {
                    // Course completed
                    alert('Félicitations ! Vous avez terminé ce cours !');
                    this.showPage('dashboard');
                }
            }

            filterCourses() {
                const searchTerm = document.getElementById('course-search').value.toLowerCase();
                const selectedCategory = document.getElementById('category-filter').value;
                
                const filteredCourses = this.courses.filter(course => {
                    const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                                        course.description.toLowerCase().includes(searchTerm) ||
                                        course.instructor.toLowerCase().includes(searchTerm);
                    const matchesCategory = !selectedCategory || course.category === selectedCategory;
                    
                    return matchesSearch && matchesCategory;
                });

                const container = document.getElementById('all-courses');
                container.innerHTML = filteredCourses.map(course => this.createCourseCard(course, true)).join('');
            }
        }

        // ========================================
        // APPLICATION INITIALIZATION
        // ========================================
        
        // Initialize the application
        const app = new AppState();
        
        // Make app globally available for onclick handlers
        window.app = app;
        
        console.log('EduPlatform initialized successfully');