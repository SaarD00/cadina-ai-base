import React, { useEffect, useRef, useState } from 'react';
import { Star, Quote, Linkedin, Twitter, Briefcase, GraduationCap, TrendingUp, Award } from 'lucide-react';

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Software Engineer",
      company: "Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612c87f?w=150&h=150&fit=crop&crop=face",
      content: "Vireia AI completely transformed my job search. I went from getting zero interviews to landing my dream job at Google in just 3 weeks. The AI suggestions were spot-on!",
      rating: 5,
      platform: "linkedin",
      metrics: { interviews: "12+", offers: "3", timeline: "3 weeks" },
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager",
      company: "Meta",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The ATS optimization feature is incredible. My resume now gets past all the initial screenings. I've never felt more confident about my applications.",
      rating: 5,
      platform: "twitter",
      metrics: { interviews: "8+", offers: "2", timeline: "2 weeks" },
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX Designer",
      company: "Apple",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "As a career changer, I was struggling to position myself. Vireia AI helped me highlight transferable skills I didn't even know I had. Game changer!",
      rating: 5,
      platform: "linkedin",
      metrics: { interviews: "15+", offers: "4", timeline: "4 weeks" },
      verified: true
    },
    {
      id: 4,
      name: "David Kim",
      title: "Data Scientist",
      company: "Netflix",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The AI understood my technical background better than most recruiters. Every suggestion was relevant and impactful. Highly recommend!",
      rating: 5,
      platform: "twitter",
      metrics: { interviews: "10+", offers: "3", timeline: "2 weeks" },
      verified: true
    },
    {
      id: 5,
      name: "Jessica Martinez",
      title: "Marketing Director",
      company: "Spotify",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content: "I've tried every resume builder out there. Nothing comes close to Vireia AI's intelligence and personalization. It's like having a personal career coach.",
      rating: 5,
      platform: "linkedin",
      metrics: { interviews: "20+", offers: "5", timeline: "5 weeks" },
      verified: true
    },
    {
      id: 6,
      name: "Alex Thompson",
      title: "DevOps Engineer",
      company: "Amazon",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      content: "The real-time feedback was invaluable. I could see my ATS score improve with each edit. Finally landed my target role with a 40% salary increase!",
      rating: 5,
      platform: "twitter",
      metrics: { interviews: "14+", offers: "3", timeline: "3 weeks" },
      verified: true
    }
  ];

  const stats = [
    { label: "Success Rate", value: "94.7%", description: "of users get interviews within 30 days" },
    { label: "Average Salary Increase", value: "+32%", description: "compared to previous positions" },
    { label: "Time to First Interview", value: "8 days", description: "average time after using Vireia AI" },
    { label: "User Satisfaction", value: "4.9/5", description: "based on 10,000+ reviews" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-sky-500" />;
      default:
        return <Star className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
            <Award className="mr-2 h-4 w-4" />
            <span>Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
            Loved by Professionals Worldwide
          </h2>
          
          <p className="max-w-3xl text-muted-foreground text-lg md:text-xl leading-relaxed">
            Join thousands of professionals who've transformed their careers with Vireia AI. 
            Real stories from real people who landed their dream jobs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`text-center p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 ${
                isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonial Showcase */}
        <div className="grid gap-8 lg:grid-cols-2 items-center mb-16">
          {/* Featured Testimonial */}
          <div className="relative">
            <div className="bg-gradient-to-br from-card/80 to-muted/40 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-2xl">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="h-6 w-6 text-primary-foreground" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl leading-relaxed text-foreground">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      {testimonials[activeTestimonial].verified && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeTestimonial].title} at {testimonials[activeTestimonial].company}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getPlatformIcon(testimonials[activeTestimonial].platform)}
                      <span className="text-xs text-muted-foreground capitalize">
                        {testimonials[activeTestimonial].platform}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Success Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {testimonials[activeTestimonial].metrics.interviews}
                    </div>
                    <div className="text-xs text-muted-foreground">Interviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {testimonials[activeTestimonial].metrics.offers}
                    </div>
                    <div className="text-xs text-muted-foreground">Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {testimonials[activeTestimonial].metrics.timeline}
                    </div>
                    <div className="text-xs text-muted-foreground">Timeline</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Company Logos Grid */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Our users work at</h3>
              <p className="text-muted-foreground">Top companies trust Vireia AI to help them find the best talent</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Google", icon: "G", color: "bg-blue-600" },
                { name: "Apple", icon: "", color: "bg-gray-800" },
                { name: "Meta", icon: "f", color: "bg-blue-500" },
                { name: "Netflix", icon: "N", color: "bg-red-600" },
                { name: "Amazon", icon: "a", color: "bg-orange-500" },
                { name: "Microsoft", icon: "⊞", color: "bg-blue-700" }
              ].map((company, index) => (
                <div
                  key={index}
                  className={`p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group ${
                    isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${company.color} flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300`}>
                      {company.icon}
                    </div>
                    <span className="font-semibold text-foreground">{company.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(1, 4).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`p-6 bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 group ${
                isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
              }`}
              style={{ animationDelay: `${800 + index * 150}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-sm text-foreground mb-4 leading-relaxed">
                "{testimonial.content.length > 120 ? testimonial.content.substring(0, 120) + '...' : testimonial.content}"
              </blockquote>
              
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border border-border/50"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <h5 className="text-sm font-semibold text-foreground">{testimonial.name}</h5>
                    {testimonial.verified && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.title}
                  </p>
                </div>
                {getPlatformIcon(testimonial.platform)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;