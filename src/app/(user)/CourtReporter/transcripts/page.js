import React from 'react';
import TranscriptManagementTable from '@/components/module/user/CourtReporter/Transcript/TranscriptManagementTable';

const Transcripts = () => {
    return (
        <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh] w-full">
            <div className="flex items-center min-h-12 mb-6">
                <h2 className="c-page-title !mb-0">Transcripts</h2>
            </div>
            <TranscriptManagementTable />
        </div>
    );
};

export default Transcripts;