(function () {
  'use strict';

  var ASSET_BASE = '';

  var FALLBACK_PROJECTS = [
    {
      name: 'English Dictionary Web Application',
      description: 'A modern web-based dictionary app providing word definitions, pronunciations, and examples.',
      tags: ['html5', 'css3', 'javascript', 'dictionary-api'],
      imageFile: 'assets/English Dictionary.png',
      source_code_link: 'https://github.com/rd-codes/English-Dictionary'
    },
    {
      name: 'Task Management Dashboard',
      description: 'A real-time task management system that Includes task categorization and priority management.',
      tags: ['react', 'nodejs', 'mongodb', 'socket.io'],
      imageFile: 'assets/Todo List.png',
      source_code_link: 'https://github.com/rd-codes/TodoList'
    },
    {
      name: 'Feedback UI',
      description: 'An interactive feedback collection app with three rating options: Unhappy, Neutral, and Satisfied.',
      tags: ['html', 'css', 'javascript', 'local-storage'],
      imageFile: 'assets/Feedback UI.png',
      source_code_link: 'https://github.com/rd-codes/Feedback-UI'
    },
    {
      name: 'Peeping-Tom Browser Extension',
      description: "A browser extension that helps users understand and answer questions by providing answers and explanations using Google's Gemini AI.",
      tags: ['javascript', 'chrome-extension', 'web-api'],
      imageFile: 'assets/Peeping Tom icon.png',
      source_code_link: 'https://github.com/rd-codes/Peeping-Tom-Browser-Extension'
    },
    {
      name: 'Math Challenge Multiplication Practice',
      description: 'An interactive math practice app focusing on multiplication skills. Features timed sessions, difficulty levels, and progress tracking.',
      tags: ['html', 'css', 'javascript'],
      imageFile: 'assets/Maths Challange Multiplication practice.png',
      source_code_link: 'https://github.com/rd-codes/Math-Challenge-Multiplication-Practice-App'
    },
    {
      name: 'Code Clinics Web App',
      description: 'A web platform for booking one-on-one coding sessions with volunteers. Includes user authentication, Google Calendar integration, and real-time slot management. Built with Python, Flask, and SQLite for efficient session scheduling.',
      tags: ['python', 'flask', 'sqlite', 'google-calendar-api'],
      imageFile: 'assets/Code Clinics img.png',
      source_code_link: 'https://github.com/rd-codes/Code-Clinics-The-Web-App'
    }
  ];

  function assetUrl(relativePath) {
    var parts = relativePath.split('/');
    return ASSET_BASE + parts.map(encodeURIComponent).join('/');
  }

  function fetchJson(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function loadProjects(projects) {
    var grid = document.getElementById('projectsGrid');
    var errEl = document.getElementById('projectsError');
    if (!grid) return;

    grid.innerHTML = '';

    projects.forEach(function (project, index) {
      var card = document.createElement('article');
      card.className = 'project-card reveal';

      var thumbWrap = document.createElement('div');
      thumbWrap.className = 'project-thumb-wrap project-thumb-inline';

      var img = document.createElement('img');
      img.className = 'project-thumb';
      img.alt = '';
      img.loading = 'lazy';
      img.src = assetUrl(project.imageFile);
      img.onerror = function () {
        thumbWrap.style.display = 'none';
      };
      thumbWrap.appendChild(img);

      var body = document.createElement('div');
      body.className = 'project-body';

      var num = document.createElement('p');
      num.className = 'project-num';
      var n = index + 1;
      num.textContent = n < 10 ? '0' + n : String(n);

      var title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.name;

      var desc = document.createElement('p');
      desc.className = 'project-desc';
      desc.textContent = project.description;

      var tagsWrap = document.createElement('div');
      tagsWrap.className = 'project-tags';
      (project.tags || []).forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsWrap.appendChild(span);
      });

      var links = document.createElement('div');
      links.className = 'project-links';

      var source = document.createElement('a');
      source.href = project.source_code_link;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = 'Source →';

      links.appendChild(source);

      body.appendChild(num);
      body.appendChild(thumbWrap);
      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(tagsWrap);
      body.appendChild(links);

      card.appendChild(body);
      grid.appendChild(card);
    });

    if (errEl) {
      errEl.hidden = true;
    }

    staggerProjectCards();
    observeReveal();
  }

  var revealObserver = null;

  function staggerProjectCards() {
    document.querySelectorAll('#projectsGrid .project-card').forEach(function (card, i) {
      card.style.transitionDelay = i * 0.08 + 's';
    });
  }

  function observeReveal() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
    }
    document.querySelectorAll('.reveal:not([data-reveal-watched])').forEach(function (el) {
      el.setAttribute('data-reveal-watched', '1');
      revealObserver.observe(el);
    });
  }

  function roleCycle() {
    var roles = document.querySelectorAll('#roleCycle em');
    if (!roles.length) return;

    var current = 0;

    setInterval(function () {
      var prev = current;
      current = (current + 1) % roles.length;
      roles[prev].classList.remove('active');
      roles[prev].classList.add('exit');
      roles[current].classList.add('active');
      setTimeout(function () {
        roles[prev].classList.remove('exit');
      }, 500);
    }, 2400);
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function showLoadError(message) {
    var errEl = document.getElementById('projectsError');
    if (errEl) {
      errEl.hidden = false;
      errEl.textContent = message;
    }
  }

  function bootstrap() {
    initYear();
    roleCycle();
    observeReveal();

    Promise.all([
      fetchJson('me/projects.json').catch(function () {
        return FALLBACK_PROJECTS;
      })
    ])
      .then(function (results) {
        var projects = results[0];
        loadProjects(projects);
      })
      .catch(function () {
        loadProjects(FALLBACK_PROJECTS);
        showLoadError(
          'Using bundled project data. Serve this folder over HTTP (e.g. VS Code Live Server) to load live JSON from the me/ folder.'
        );
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
