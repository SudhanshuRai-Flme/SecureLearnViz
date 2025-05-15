export default function LearningPath() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Your Learning Path</h2>
      <div className="relative">
        {/* Path Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-800 transform -translate-x-1/2"></div>
        
        {/* Milestones */}
        <div className="relative z-10">
          {/* Milestone 1 */}
          <div className="flex items-center mb-8">
            <div className="w-1/2 pr-8 text-right">
              <h3 className="font-semibold text-lg">Network Basics</h3>
              <p className="text-sm text-gray-400">Learn the fundamentals of how networks operate</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-dark">
              <span className="text-xs font-bold">1</span>
            </div>
            <div className="w-1/2 pl-8">
              <span className="text-xs py-1 px-2 rounded bg-primary bg-opacity-20 text-primary">
                In Progress
              </span>
            </div>
          </div>
          
          {/* Milestone 2 */}
          <div className="flex items-center mb-8">
            <div className="w-1/2 pr-8 text-right">
              <span className="text-xs py-1 px-2 rounded bg-gray-800 text-gray-400">
                Coming Up
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border-4 border-dark">
              <span className="text-xs font-bold">2</span>
            </div>
            <div className="w-1/2 pl-8">
              <h3 className="font-semibold text-lg">OS Fundamentals</h3>
              <p className="text-sm text-gray-400">Understand operating system components and security</p>
            </div>
          </div>
          
          {/* Milestone 3 */}
          <div className="flex items-center mb-8">
            <div className="w-1/2 pr-8 text-right">
              <h3 className="font-semibold text-lg">Web Vulnerabilities</h3>
              <p className="text-sm text-gray-400">Explore common attack vectors in web applications</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border-4 border-dark">
              <span className="text-xs font-bold">3</span>
            </div>
            <div className="w-1/2 pl-8">
              <span className="text-xs py-1 px-2 rounded bg-gray-800 text-gray-400">
                Coming Up
              </span>
            </div>
          </div>
          
          {/* Milestone 4 */}
          <div className="flex items-center">
            <div className="w-1/2 pr-8 text-right">
              <span className="text-xs py-1 px-2 rounded bg-gray-800 text-gray-400">
                Coming Up
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border-4 border-dark">
              <span className="text-xs font-bold">4</span>
            </div>
            <div className="w-1/2 pl-8">
              <h3 className="font-semibold text-lg">Security Testing</h3>
              <p className="text-sm text-gray-400">Learn practical techniques for finding vulnerabilities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
