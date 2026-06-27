import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NAV_LINKS = ["About", "Courses", "Contact"];

const STATS = [
  { value: "5000+", label: "Students Enrolled" },
  { value: "200+", label: "Faculty Members" },
  { value: "50+", label: "Courses Offered" },
  { value: "25+", label: "Years of Excellence" },
];

const COURSES = [
  {
    code: "CS",
    name: "Computer Science",
    description:
      "Cutting-edge curriculum covering algorithms, AI, software engineering and more.",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    code: "EC",
    name: "Electronics & Communication",
    description:
      "Explore signal processing, embedded systems, VLSI design and communication networks.",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
    description:
      "From thermodynamics to robotics — a comprehensive mechanical engineering program.",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  {
    code: "CE",
    name: "Civil Engineering",
    description:
      "Structural design, environmental engineering and modern construction management.",
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
  },
  {
    code: "BBA",
    name: "Business Administration",
    description:
      "Leadership, finance, marketing and entrepreneurship for future business leaders.",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    code: "MCA",
    name: "Master of Computer Applications",
    description:
      "Advanced computing, database management and enterprise application development.",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSent, setFormSent] = useState(false);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              KTM
            </div>
            <span className="font-semibold text-gray-800 text-sm leading-tight">
              KTM College of <br className="hidden sm:block" />
              Science and Technology
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition"
              >
                {link}
              </button>
            ))}

            <div className="relative group">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition">
                Login
              </button>

              <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                <div className="bg-white rounded-lg shadow-lg border">
                <button
                  onClick={() => navigate("/login/student")}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  Student Login
                </button>

                <button
                  onClick={() => navigate("/login/faculty")}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  Faculty Login
                </button>

                <button
                  onClick={() => navigate("/login/admin")}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-3 bg-white">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="text-sm text-gray-600 hover:text-blue-600 text-left font-medium"
              >
                {link}
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                Login ▼
              </button>

              {loginOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                  <button
                    onClick={() => navigate("/login/student")}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    Student Login
                  </button>

                  <button
                    onClick={() => navigate("/login/faculty")}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    Faculty Login
                  </button>

                  <button
                    onClick={() => navigate("/login/admin")}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    Admin Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center gap-6">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-widest">
            Established 1999
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
            KTM College of Science and Technology
          </h1>
          <p className="text-lg text-blue-100 max-w-xl">
            Empowering the next generation of innovators, engineers, and leaders
            through world-class education and research.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            
            <button
              onClick={() => scrollTo("about")}
              className="px-6 py-3 bg-transparent border border-white/50 text-white font-semibold rounded-md hover:bg-white/10 transition"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              About Us
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
              A Legacy of Academic Excellence
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 1999, KTM College of Science and Technology has grown
              into one of the region's most respected institutions. We are
              committed to fostering critical thinking, innovation, and
              professional excellence in every student.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our state-of-the-art facilities, experienced faculty, and
              industry-aligned curriculum ensure that graduates are ready to
              lead in a rapidly evolving world.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "NAAC Accredited Institution",
                "Industry-aligned curriculum",
                "100% placement assistance",
                "Modern labs and infrastructure",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 flex flex-col gap-4 border border-blue-200">
            {[
              { label: "Vision", text: "To be a globally recognized institution nurturing talent and innovation." },
              { label: "Mission", text: "Providing quality education that prepares students for challenges of tomorrow." },
              { label: "Values", text: "Integrity, Excellence, Innovation, Inclusivity, and Community." },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPAL'S MESSAGE ── */}
<section className="py-20 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-12">
      <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
        From the Desk of
      </span>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        Principal's Message
      </h2>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
      
      {/* Avatar + name */}
      <div className="flex flex-col items-center text-center flex-shrink-0">
        <img
  src="/src/assets/Principal.png"
  alt="Principal"
  className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
/>
        <p className="mt-4 font-semibold text-gray-800 text-base">
          Dr. Arjun Menon
        </p>
        <p className="text-sm text-blue-600 font-medium">Principal</p>
        <p className="text-xs text-gray-500 mt-1">
          KTM College of Science and Technology
        </p>
      </div>

      {/* Message */}
      <div className="flex-1">
        <svg
          className="w-10 h-10 text-blue-200 mb-4"
          fill="currentColor"
          viewBox="0 0 32 32"
        >
          <path d="M10 8C6.134 8 3 11.134 3 15s3.134 7 7 7c.462 0 .91-.045 1.343-.13C10.796 23.385 10 25.6 10 28h3c0-2.946 1.375-5.506 3.5-7.187A6.978 6.978 0 0017 15c0-3.866-3.134-7-7-7zm15 0c-3.866 0-7 3.134-7 7a6.978 6.978 0 003.5 5.813C23.625 22.494 25 25.054 25 28h3c0-2.4-.796-4.615-1.343-6.13.433.085.881.13 1.343.13 3.866 0 7-3.134 7-7s-3.134-7-7-7z" />
        </svg>

        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          <p>
            Welcome to KTM College of Science and Technology — an institution
            built on the pillars of academic excellence, integrity, and
            innovation. It is my privilege to lead a community of passionate
            students, dedicated faculty, and committed staff who together make
            this institution truly special.
          </p>
          <p>
            At KTM, we believe education goes beyond textbooks. We strive to
            create an environment where curiosity is encouraged, creativity
            is celebrated, and every student is empowered to discover their
            full potential. Our programs are carefully designed to bridge the
            gap between academic knowledge and real-world application.
          </p>
          <p>
            As you navigate through your journey here — whether as a student,
            faculty member, or visitor — I invite you to embrace the
            opportunities this institution offers. The College Management
            Portal is one such initiative, designed to bring transparency,
            efficiency, and ease to every aspect of academic life.
          </p>
          <p className="font-medium text-gray-700 italic">
            "Education is not the filling of a pail, but the lighting of a fire."
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-blue-100">
          <p className="text-sm font-semibold text-gray-800">Dr. Arjun Menon</p>
          <p className="text-xs text-gray-500">Ph.D | M.Tech | B.Tech</p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ── COURSES ── */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Academics
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              Our Programs
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
              Choose from a wide range of undergraduate and postgraduate
              programs designed for the careers of tomorrow.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COURSES.map((course) => (
              <div
                key={course.code}
                className={`rounded-xl border p-5 ${course.color} hover:shadow-md transition`}
              >
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${course.badge}`}>
                  {course.code}
                </span>
                <h3 className="text-base font-semibold text-gray-800 mt-3 mb-2">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Contact Us
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Have questions about admissions, programs, or the portal? We're
              here to help.
            </p>
            <div className="flex flex-col gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Address</p>
                  <p>KTM Campus, College Road, Kerala, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <p>info@ktmcollege.ac.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Phone</p>
                  <p>+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            {formSent ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-800">Message Sent!</p>
                <p className="text-sm text-gray-500 text-center">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setFormSent(false)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Send us a message
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="font-medium text-white">
            KTM College of Science and Technology
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <p className="text-blue-400">
            Staff & Student Portal
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;