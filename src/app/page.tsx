"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import { Moon, Sun, ChevronDown, ChevronRight } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [currentSection, setCurrentSection] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  const [expandedSubjects, setExpandedSubjects] = useState<{ [key: string]: boolean }>({})
  const [expandedYears, setExpandedYears] = useState<{ [key: string]: boolean }>({})
  const [expandedResources, setExpandedResources] = useState<{ [key: string]: boolean }>({})

  const toggleSubject = (subject: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [subject]: !prev[subject] }))
  }

  const toggleYear = (key: string) => {
    setExpandedYears((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleResource = (resource: string) => {
    setExpandedResources((prev) => ({ ...prev, [resource]: !prev[resource] }))
  }

  useEffect(() => {
    setIsLoaded(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setIsDark(savedTheme === "dark")
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(newTheme === "dark")
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const sectionWidth = scrollContainerRef.current.offsetWidth
      const scrollLeft = scrollContainerRef.current.scrollLeft
      const newSection = Math.round(scrollLeft / sectionWidth)

      if (newSection !== currentSection) {
        setCurrentSection(newSection)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        // Prevent rapid scrolling - only allow one section change at a time
        if (isScrollingRef.current) return
        isScrollingRef.current = true

        // Scroll down = next section, scroll up = previous section
        if (e.deltaY > 0 && currentSection < 2) {
          scrollToSection(currentSection + 1)
        } else if (e.deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }

        // Reset scrolling lock after animation completes
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false
        }, 600) // Match this with scroll animation duration
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
        }}
      />

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <span className="font-sans text-2xl font-bold tracking-tight text-white">Nile Nerds</span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {["Home", "Practice", "Resources"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${currentSection === index ? "text-accent" : "text-white/90 hover:text-accent"
                }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                  }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => alert("Login functionality coming soon!")}>
          Login
        </MagneticButton>
      </nav>

      <button
        onClick={toggleTheme}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-accent/30 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-5 w-5 text-accent" /> : <Moon className="h-5 w-5 text-accent" />}
      </button>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Home Section */}
        <section
          className="relative flex min-w-full flex-col items-center justify-start px-6 pt-40 pb-32 md:px-12 md:pt-48"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-3xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-accent/30 bg-accent/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-accent">Ethiopian G12 Excellence</p>
            </div>
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-6xl font-light leading-[1.1] tracking-tight text-white duration-1000 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                Master your G12
                <br />
                <span className="text-accent">National Exam</span>
              </span>
            </h1>
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-white/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                Comprehensive preparation resources designed specifically for Ethiopian students. Practice tests, study
                materials, and expert guidance to help you excel.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => scrollToSection(1)}
                className="text-black transition-all duration-300 hover:bg-white hover:text-black"
              >
                Start Practicing
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection(2)}
                className="transition-all duration-300 hover:bg-white hover:text-black"
              >
                Browse Resources
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-white/80">Scroll to explore</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* Practice Section */}
        <section
          className="relative flex min-w-full flex-col items-center justify-start px-6 pt-40 pb-32 md:px-12 md:pt-48"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-12">
              <h2 className="mb-4 font-sans text-5xl font-light tracking-tight text-white md:text-6xl">
                Practice Tests
              </h2>
              <p className="text-lg text-white/80">Sharpen your skills with our comprehensive practice exams</p>
            </div>

            <div className="space-y-0.5">
              {/* Art Subject */}
              <div>
                <button
                  onClick={() => toggleSubject("art")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedSubjects["art"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Art</span>
                </button>
              </div>

              {/* Science Subject */}
              <div>
                <button
                  onClick={() => toggleSubject("science")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedSubjects["science"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Science</span>
                </button>

                {expandedSubjects["science"] && (
                  <div className="ml-4 border-l border-white/10">
                    {/* Mathematics */}
                    <div className="relative">
                      <button
                        onClick={() => toggleSubject("mathematics")}
                        className="group flex w-full items-center gap-2 rounded px-2 py-1 pl-3 text-left transition-colors hover:bg-white/5"
                      >
                        {expandedSubjects["mathematics"] ? (
                          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                        )}
                        <span className="font-sans text-base text-white/90 group-hover:text-white">Mathematics</span>
                      </button>

                      {expandedSubjects["mathematics"] && (
                        <div className="ml-4 border-l border-white/10">
                          {["2010", "2011", "2012", "2013"].map((year) => (
                            <div key={year}>
                              <button
                                onClick={() => toggleYear(`math-${year}`)}
                                className="group flex w-full items-center gap-2 rounded px-2 py-1 pl-3 text-left transition-colors hover:bg-white/5"
                              >
                                {expandedYears[`math-${year}`] ? (
                                  <ChevronDown className="h-3 w-3 text-white/40" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-white/40" />
                                )}
                                <span className="font-mono text-sm text-white/60 group-hover:text-white/80">
                                  {year}
                                </span>
                              </button>

                              {expandedYears[`math-${year}`] && (
                                <div className="ml-4 border-l border-white/10">
                                  <button className="flex w-full items-center gap-2 rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                                    Practice Mode
                                  </button>
                                  <button className="flex w-full items-center gap-2 rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                                    Exam Mode
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Physics */}
                    <div className="relative">
                      <button
                        onClick={() => toggleSubject("physics")}
                        className="group flex w-full items-center gap-2 rounded px-2 py-1 pl-3 text-left transition-colors hover:bg-white/5"
                      >
                        {expandedSubjects["physics"] ? (
                          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                        )}
                        <span className="font-sans text-base text-white/90 group-hover:text-white">Physics</span>
                      </button>

                      {expandedSubjects["physics"] && (
                        <div className="ml-4 border-l border-white/10">
                          {["2010", "2011", "2012"].map((year) => (
                            <div key={year}>
                              <button
                                onClick={() => toggleYear(`physics-${year}`)}
                                className="group flex w-full items-center gap-2 rounded px-2 py-1 pl-3 text-left transition-colors hover:bg-white/5"
                              >
                                {expandedYears[`physics-${year}`] ? (
                                  <ChevronDown className="h-3 w-3 text-white/40" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 text-white/40" />
                                )}
                                <span className="font-mono text-sm text-white/60 group-hover:text-white/80">
                                  {year}
                                </span>
                              </button>

                              {expandedYears[`physics-${year}`] && (
                                <div className="ml-4 border-l border-white/10">
                                  <button className="flex w-full items-center gap-2 rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                                    Practice Mode
                                  </button>
                                  <button className="flex w-full items-center gap-2 rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                                    Exam Mode
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Chemistry */}
                    <button
                      onClick={() => toggleSubject("chemistry")}
                      className="group flex w-full items-center gap-2 rounded px-2 py-1 pl-3 text-left transition-colors hover:bg-white/5"
                    >
                      {expandedSubjects["chemistry"] ? (
                        <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                      )}
                      <span className="font-sans text-base text-white/90 group-hover:text-white">Chemistry</span>
                    </button>

                    {/* Biology */}
                    <button
                      onClick={() => toggleSubject("biology")}
                      className="group flex w-full items-center gap-2 rounded px-2 py-1 pl-3 text-left transition-colors hover:bg-white/5"
                    >
                      {expandedSubjects["biology"] ? (
                        <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                      )}
                      <span className="font-sans text-base text-white/90 group-hover:text-white">Biology</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Social Studies */}
              <div>
                <button
                  onClick={() => toggleSubject("social")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedSubjects["social"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Social Studies</span>
                </button>
              </div>

              {/* Languages */}
              <div>
                <button
                  onClick={() => toggleSubject("languages")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedSubjects["languages"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Languages</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section
          className="relative flex min-w-full flex-col items-center justify-start px-6 pt-40 pb-32 md:px-12 md:pt-48"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="mx-auto w-full max-w-4xl">
            <div className="mb-12">
              <h2 className="mb-4 font-sans text-5xl font-light tracking-tight text-white md:text-6xl">
                Study Resources
              </h2>
              <p className="text-lg text-white/80">Everything you need to succeed in your G12 national exam</p>
            </div>

            <div className="space-y-0.5">
              {/* Study Guides */}
              <div>
                <button
                  onClick={() => toggleResource("guides")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedResources["guides"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Study Guides</span>
                </button>

                {expandedResources["guides"] && (
                  <div className="ml-4 border-l border-white/10">
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Mathematics Guide
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Physics Guide
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Chemistry Guide
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Biology Guide
                    </button>
                  </div>
                )}
              </div>

              {/* Video Tutorials */}
              <div>
                <button
                  onClick={() => toggleResource("videos")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedResources["videos"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Video Tutorials</span>
                </button>

                {expandedResources["videos"] && (
                  <div className="ml-4 border-l border-white/10">
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Algebra Fundamentals
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Calculus Basics
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Organic Chemistry
                    </button>
                  </div>
                )}
              </div>

              {/* Performance Analytics */}
              <div>
                <button
                  onClick={() => toggleResource("analytics")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedResources["analytics"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">
                    Performance Analytics
                  </span>
                </button>

                {expandedResources["analytics"] && (
                  <div className="ml-4 border-l border-white/10">
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Progress Dashboard
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Strength & Weakness Analysis
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Time Management Stats
                    </button>
                  </div>
                )}
              </div>

              {/* Study Groups */}
              <div>
                <button
                  onClick={() => toggleResource("groups")}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-white/5"
                >
                  {expandedResources["groups"] ? (
                    <ChevronDown className="h-3.5 w-3.5 text-white/40" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                  )}
                  <span className="font-sans text-base text-white/90 group-hover:text-white">Study Groups</span>
                </button>

                {expandedResources["groups"] && (
                  <div className="ml-4 border-l border-white/10">
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Join Public Groups
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Create Private Group
                    </button>
                    <button className="flex w-full items-center rounded px-2 py-1 pl-5 text-left text-sm text-white/50 transition-colors hover:bg-accent/20 hover:text-accent">
                      Find Study Partners
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
