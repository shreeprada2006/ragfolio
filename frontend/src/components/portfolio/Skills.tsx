import { motion } from 'framer-motion'

export function Skills() {
    const categories = [
        { name: 'Languages', skills: ['Java', 'Python'] },
        { name: 'Web Technologies', skills: ['HTML', 'CSS', 'JavaScript'] },
        { name: 'Concepts', skills: ['Basic Data Structures', 'Web Development', 'Data Analysis'] },
    ]

    return (
        <section className="py-12 px-4 border-t border-zinc-800/50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-white mb-6">Skills & Technologies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-900 pb-2">
                                {cat.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {cat.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-xs hover:border-zinc-700 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
