const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 8080;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Node.js App | Live on AWS</title>
  <meta name="description" content="A modern Node.js application deployed on AWS Elastic Beanstalk via CodePipeline."/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: red;
      --surface: rgba(255,255,255,0.04);
      --border: rgba(255,255,255,0.08);
      --accent1: #7c3aed;
      --accent2: #2563eb;
      --accent3: #06b6d4;
      --green: #22c55e;
      --text: #f1f5f9;
      --muted: #94a3b8;
    }

    html, body {
      min-height: 100vh;
      background: var(--bg);
      font-family: 'Inter', sans-serif;
      color: var(--text);
      overflow-x: hidden;
    }

    /* Animated gradient orbs */
    .orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.25;
      animation: drift 12s ease-in-out infinite alternate;
      pointer-events: none;
      z-index: 0;
    }
    .orb1 { width: 600px; height: 600px; background: var(--accent1); top: -200px; left: -150px; animation-delay: 0s; }
    .orb2 { width: 500px; height: 500px; background: var(--accent2); bottom: -150px; right: -100px; animation-delay: -4s; }
    .orb3 { width: 350px; height: 350px; background: var(--accent3); top: 40%; left: 50%; animation-delay: -8s; }

    @keyframes drift {
      from { transform: translate(0, 0) scale(1); }
      to   { transform: translate(40px, 30px) scale(1.08); }
    }

    /* Grid noise texture overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      gap: 40px;
    }

    /* Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--accent3);
      backdrop-filter: blur(12px);
      animation: fadeDown 0.6s ease both;
    }
    .badge-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.5; transform: scale(1.4); }
    }

    /* Hero */
    .hero { text-align: center; animation: fadeUp 0.7s ease 0.1s both; }
    .hero h1 {
      font-size: clamp(2.8rem, 7vw, 5.5rem);
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #e0e7ff 0%, #a78bfa 40%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 20px;
    }
    .hero p {
      font-size: 1.15rem;
      color: var(--muted);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.7;
      font-weight: 300;
    }

    /* Cards grid */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      width: 100%;
      max-width: 900px;
      animation: fadeUp 0.7s ease 0.2s both;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px 24px;
      backdrop-filter: blur(20px);
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      cursor: default;
    }
    .card:hover {
      transform: translateY(-6px);
      border-color: rgba(124,58,237,0.5);
      box-shadow: 0 20px 60px rgba(124,58,237,0.15);
    }
    .card-icon {
      font-size: 2rem;
      margin-bottom: 14px;
      display: block;
    }
    .card-label {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .card-value {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text);
      word-break: break-all;
    }
    .card-value.green { color: var(--green); }
    .card-value.cyan  { color: var(--accent3); }
    .card-value.purple{ color: #a78bfa; }

    /* Pipeline banner */
    .pipeline {
      width: 100%;
      max-width: 900px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px 32px;
      backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      animation: fadeUp 0.7s ease 0.3s both;
    }
    .pipeline-label { font-size: 0.8rem; color: var(--muted); margin-bottom: 4px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
    .pipeline-steps {
      display: flex;
      align-items: center;
      gap: 0;
      flex-wrap: wrap;
    }
    .step {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;
      font-weight: 600;
    }
    .step-icon {
      width: 32px; height: 32px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.9rem;
    }
    .step-icon.done { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); }
    .step-arrow { color: var(--muted); margin: 0 8px; font-size: 1rem; }

    /* CTA button */
    .cta-wrap { animation: fadeUp 0.7s ease 0.4s both; }
    .cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: linear-gradient(135deg, var(--accent1), var(--accent2));
      border: none;
      border-radius: 999px;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 30px rgba(124,58,237,0.4);
    }
    .cta:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 40px rgba(124,58,237,0.6);
    }

    /* Footer */
    .footer {
      font-size: 0.78rem;
      color: var(--muted);
      text-align: center;
      animation: fadeUp 0.7s ease 0.5s both;
    }
    .footer span { color: #a78bfa; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:none; } }
    @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:none; } }

    @media (max-width: 600px) {
      .pipeline { flex-direction: column; }
      .cards { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="orb orb3"></div>

  <main class="page">

    <div class="badge">
      <span class="badge-dot"></span>
      Deployed &amp; Running on AWS
    </div>

    <div class="hero">
      <h1>Hello, World.</h1>
      <p>A minimal Node.js application — live on <strong style="color:#e0e7ff">AWS Elastic Beanstalk</strong>, delivered via <strong style="color:#e0e7ff">CodePipeline</strong>.</p>
    </div>

    <div class="cards">
      <div class="card">
        <span class="card-icon">⚡</span>
        <div class="card-label">Status</div>
        <div class="card-value green">● Online</div>
      </div>
      <div class="card">
        <span class="card-icon">🟢</span>
        <div class="card-label">Runtime</div>
        <div class="card-value cyan">Node.js ${process.version}</div>
      </div>
      <div class="card">
        <span class="card-icon">🌐</span>
        <div class="card-label">Port</div>
        <div class="card-value purple">${PORT}</div>
      </div>
      <div class="card">
        <span class="card-icon">💾</span>
        <div class="card-label">Platform</div>
        <div class="card-value">${os.type()} ${os.arch()}</div>
      </div>
    </div>

    <div class="pipeline">
      <div>
        <div class="pipeline-label">🚀 CI/CD Pipeline</div>
      </div>
      <div class="pipeline-steps">
        <div class="step">
          <div class="step-icon done">🐙</div>
          <span>GitHub</span>
        </div>
        <span class="step-arrow">→</span>
        <div class="step">
          <div class="step-icon done">🔧</div>
          <span>CodePipeline</span>
        </div>
        <span class="step-arrow">→</span>
        <div class="step">
          <div class="step-icon done">☁️</div>
          <span>Elastic Beanstalk</span>
        </div>
        <span class="step-arrow">→</span>
        <div class="step">
          <div class="step-icon done">✅</div>
          <span>Live</span>
        </div>
      </div>
    </div>

    <div class="cta-wrap">
      <a class="cta" href="https://github.com/GhulamGhaus1/AWS-devops-practise-repo" target="_blank" rel="noopener">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
        View Source on GitHub
      </a>
    </div>

    <footer class="footer">
      Built with <span>♥</span> using Node.js &nbsp;·&nbsp; Deployed on AWS &nbsp;·&nbsp; ${new Date().getFullYear()}
    </footer>

  </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
