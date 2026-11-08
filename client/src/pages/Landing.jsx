
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Users,
  Building2,
  ClipboardList
} from "lucide-react";

const categories = [
  {
    name: "Road Problems",
    description: "Report potholes, damaged roads and unsafe streets.",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Garbage Management",
    description: "Report overflowing bins and unclean public spaces.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Water Supply",
    description: "Bring attention to water leaks and supply issues.",
    image: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=700&q=80"
  },
  {
    name: "Public Infrastructure",
    description: "Help improve drainage, electricity and public facilities.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80"
  }
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      <nav className="landing-navbar">
        <div className="landing-logo">
          Civic<span>Pulse</span>
          <small>COMMUNITY FIRST. CHANGE TOGETHER.</small>
        </div>

        <div className="landing-nav-links">
          <a href="#about">About</a>
          <a href="#categories">Issue Categories</a>
          <button
            className="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="landing-register-btn"
            onClick={() => navigate("/register")}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <img
          className="landing-hero-image"
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=2000&q=85"
          alt="Modern city buildings and community"
        />

        <div className="landing-hero-overlay" />

        <div className="landing-hero-content">
          <span className="landing-eyebrow">
            <MapPin size={15} /> YOUR COMMUNITY, YOUR VOICE
          </span>

          <h1>
            Better Communities
            <br />
            Begin With <span>Your Voice.</span>
          </h1>

          <p>
            Report civic problems, track their progress and
            work together to create cleaner, safer and better
            neighbourhoods.
          </p>

          <div className="landing-hero-actions">
            <button
              className="landing-primary-btn"
              onClick={() => navigate("/register")}
            >
              Report an Issue <ArrowRight size={18} />
            </button>

            <button
              className="landing-secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login to Account
            </button>
          </div>

          <div className="landing-hero-trust">
            <ShieldCheck size={17} />
            Simple. Transparent. Community-driven.
          </div>
        </div>
      </section>

      <section className="landing-stats">
        <div>
          <Users size={25} />
          <h3>Community Driven</h3>
          <p>Every citizen can make a difference.</p>
        </div>
        <div>
          <ClipboardList size={25} />
          <h3>Easy Reporting</h3>
          <p>Submit issues in just a few steps.</p>
        </div>
        <div>
          <ShieldCheck size={25} />
          <h3>Track Progress</h3>
          <p>Stay updated on complaint status.</p>
        </div>
        <div>
          <Building2 size={25} />
          <h3>Better Communities</h3>
          <p>Work towards a better neighbourhood.</p>
        </div>
      </section>

      <section className="landing-categories" id="categories">
        <div className="landing-section-heading">
          <span>WHAT CAN YOU REPORT?</span>
          <h2>Every Issue Deserves Attention</h2>
          <p>
            From damaged roads to overflowing garbage,
            help us identify the problems around you.
          </p>
        </div>

        <div className="landing-category-grid">
          {categories.map((category) => (
            <article className="landing-category-card" key={category.name}>
              <img src={category.image} alt={category.name} />
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-about" id="about">
        <div className="landing-about-image">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1000&q=85"
            alt="People working together for their community"
          />
        </div>

        <div className="landing-about-content">
          <span>WHY CIVICPULSE?</span>
          <h2>Small Actions. Meaningful Change.</h2>
          <p>
            CivicPulse connects citizens with a simple way to
            report local problems and follow their progress.
            Because improving a community starts when people
            speak up and take action.
          </p>

          <button
            className="landing-primary-btn"
            onClick={() => navigate("/register")}
          >
            Join CivicPulse <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="landing-bottom-cta">
        <h2>Your Community Needs Your Voice.</h2>
        <p>Take the first step towards making a difference today.</p>
        <button
          className="landing-primary-btn"
          onClick={() => navigate("/register")}
        >
          Get Started <ArrowRight size={18} />
        </button>
      </section>

      <footer className="landing-footer">
        <h2>Civic<span>Pulse</span></h2>
        <p>Community first. Change together.</p>
        <small>© 2026 CivicPulse. Making communities better.</small>
      </footer>

    </div>
  );
}

export default Landing;
