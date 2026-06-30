import { ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { ViewProjectButton } from "../components/ViewProjectButton";

const projects = [
  {
    title: "Job Portal Web Application",
    description:
      "Full-stack job portal connecting job seekers and recruiters with secure authentication, job search and application management built using MERN stack",
    image: "/Projects/project1.png",
    tags: ["React", "Node.js", "MongoDb", "Express.js"],
    link: "#",
    github: "https://github.com/luvdevcodes/Job-Portal",
  },
];

export const Project = () => {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
     
      <div className="container mx-auto px-6 relative z-10">
        {/** Section header */}
        <div className="text-center mx-auto  mx-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in ">
            Featured work
          </span>
          <h2 className=" text-secondary-foreground text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100">
            Projects that
            <span className="font-serif italic font-normal text-white">
              {" "}
              make an impact,
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            A selection of my work, from complex web applications to innovative
            tools that solve real-world problems.
          </p>
        </div>
        {/** Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group glass rounded-2xl overflow-hidden md:row-span-1"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/** image */}
              <div className="relative overflow-hidden aspects-video ">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent opacity-60  " />
                {/** Overlay link */}
                <div className="absolute inset-0 flex items-center justify-center space-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.link}
                    className="p-3 rounded-full glass hover:text-primary-foreground hover:bg-primary transition-all mr-2"
                  >
                    <ArrowUpRight className=" w-5 h-5 " />
                  </a>
                  <a
                    href={project.github}
                    className="p-3 rounded-full glass hover:text-primary-foreground hover:bg-primary transition-all"
                  >
                    <FiGithub className=" w-5 h-5 " />
                  </a>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 sapace-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    className="w-5 h-5 
                  text-muted-foreground group-hover:text-primary
                   group-hover:translate-x-1 
                   group-hover:-translate-y-1 transition-all"
                  />
                </div>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 ">
                  {project.tags.map((tag, tagIdx) => (
                    <span className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 mt-2 hover:text-primary transition-all duration-300">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* view all CTA */}
        <div className="text-center mt-12 animate-fade-in animation-delay-500 ">
            <ViewProjectButton>
                View All Projects 
                <ArrowUpRight  className="w-5 h-5 mt-2"/>
            </ViewProjectButton>
        </div>
      </div>
    </section>
  );
};
