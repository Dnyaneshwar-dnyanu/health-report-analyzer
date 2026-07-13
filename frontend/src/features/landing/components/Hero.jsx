import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUploadCloud } from 'react-icons/fi';
import { Button } from '../../../components/common/Button/Button';
import { Badge } from '../../../components/common/Badge/Badge';
import { Section } from '../../../components/common/Section/Section';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <Section className="pt-12 pb-16 md:pt-24 md:pb-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        <Badge variant="primary" className="mb-6">
          ✨ Introducing AI Blood Report Analysis
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Understand Your Health <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-400">
            In Seconds, Not Hours.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-muted)] mb-10 max-w-2xl">
          Upload your standard blood report and let our advanced AI instantly extract, 
          analyze, and explain your biomarkers. Take control of your health with clear, 
          actionable insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            size="lg" 
            icon={FiUploadCloud}
            onClick={() => navigate('/upload')}
          >
            Upload Report
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            icon={FiArrowRight}
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it Works
          </Button>
        </div>
      </motion.div>
    </Section>
  );
};