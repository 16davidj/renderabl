import { Job } from '../types';
import '../app.css'; // Import CSS file for styling

interface JobRunCardProps {
    jobs: Job[];
}

const JobRunCard = ({ jobs }: JobRunCardProps) => {
    if (jobs.length > 0) {
        return (
            <div className="job-run-card-container">
                {jobs.map((job, index) => (
                    <div key={job.id} className="job-run-card">
                        <h3 className="job-name">{job.name}</h3>
                        <p className="job-detail"><strong>Cell:</strong> {job.cell}</p>
                        <p className="job-detail"><strong>Created At:</strong> {new Date(job.createdAt).toLocaleString()}</p>
                        <p className="job-detail"><strong>Duration:</strong> {job.durationMin} minutes</p>
                        <p className="job-detail"><strong>Succeeded:</strong> {job.success ? 'Yes' : 'No'}</p>
                        <p className="job-detail"><strong>Resource Usage:</strong> {job.resourceUsage}</p>
                    </div>
                ))}
            </div>
        );
    }
    return null; // Return null if no jobs
};

export default JobRunCard;
