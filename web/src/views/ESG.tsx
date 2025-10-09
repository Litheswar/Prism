import React from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist-min';

const Plot = createPlotlyComponent(Plotly);

// Sample data for charts
const greenMaterialData = {
  projects: ['KN-01', 'DS-KER-005', 'TL-DLI-001', 'MH-GOA-004', 'RJ-JPR-009'],
  values: [15, 80, 25, 60, 45],
  gradients: [
    ['#A8E063', '#56AB2F'], // KN-01
    ['#9BE15D', '#00E3AE'], // DS-KER-005
    ['#F9F871', '#A1FFCE'], // TL-DLI-001
    ['#38EF7D', '#11998E'], // MH-GOA-004
    ['#DCE35B', '#45B649']  // RJ-JPR-009
  ]
};

const esgRatingData = {
  ratings: ['A+', 'A', 'B+', 'B', 'C', 'D'],
  counts: [3, 3, 2, 1, 1, 2],
  percentages: [25, 25, 17, 8, 8, 17],
  colors: [
    ['#11998E', '#38EF7D'], // A+ gradient - green
    ['#43CEA2', '#185A9D'], // A gradient - teal-blue
    ['#F7971E', '#FFD200'], // B+ gradient - orange-yellow
    ['#FCE38A', '#F38181'], // B gradient - soft peach
    ['#FF416C', '#FF4B2B'], // C gradient - coral red
    ['#B06AB3', '#4568DC']  // D gradient - purple-blue
  ]
};

const projectScoresData = [
  { id: 'DS-KER-005', env: 85, soc: 78, gov: 90, overall: 'A+', status: 'Compliant' },
  { id: 'TL-DLI-001', env: 60, soc: 55, gov: 70, overall: 'B', status: 'Under Review' },
  { id: 'KN-01', env: 40, soc: 35, gov: 50, overall: 'C', status: 'Under Review' },
  { id: 'RJ-JPR-009', env: 75, soc: 82, gov: 80, overall: 'A', status: 'Compliant' },
  { id: 'MH-GOA-004', env: 72, soc: 68, gov: 75, overall: 'B+', status: 'Compliant' },
];

export default function ESG(){
  return (
    <div className="space-y-6">
      {/* Header Section with Gradient Background */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#E3FDF5] to-[#FFE6FA] backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">ESG & Sustainability Insights</h1>
          <p className="text-slate-600 text-lg">Environmental, Social, and Governance impact metrics</p>
        </div>
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-0"></div>
      </div>
      
      {/* KPI Cards Section with Gradient Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GradientKpiCard 
          label="CO₂ Saved" 
          value="5200t" 
          description="Carbon reduction" 
          gradientFrom="#A8E063"
          gradientTo="#56AB2F"
          textColor="text-white"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>}
        />
        
        <GradientKpiCard 
          label="Renewable Usage" 
          value="29%" 
          description="Average across projects" 
          gradientFrom="#74EBD5"
          gradientTo="#9FACE6"
          textColor="text-slate-800"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>}
        />
        
        <GradientKpiCard 
          label="Community Impact" 
          value="47" 
          description="Average score" 
          gradientFrom="#C471F5"
          gradientTo="#FA71CD"
          textColor="text-white"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>}
        />
        
        <GradientKpiCard 
          label="ESG Compliant" 
          value="11" 
          description="Rated projects" 
          gradientFrom="#FAD961"
          gradientTo="#F76B1C"
          textColor="text-slate-800"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>}
        />
      </div>
      
      {/* Charts Section with Gradient Backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Green Material Usage Chart with Flat Modern Style */}
        <div className="p-6 rounded-2xl bg-white shadow-md">
          <div className="font-medium flex items-center mb-4 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              Green Material Usage by Project
            </span>
          </div>
          <div className="mt-2">
            <Plot
              data={[
                {
                  type: 'bar',
                  x: greenMaterialData.projects,
                  y: greenMaterialData.values,
                  marker: {
                    color: '#4CAF50', // Flat green color
                    opacity: 1,
                    line: {
                      width: 0
                    }
                  },
                  hoverinfo: 'y',
                  hovertemplate: '<b>%{x}</b><br>%{y}%<extra></extra>',
                  hoverlabel: {
                    bgcolor: 'white',
                    bordercolor: '#4CAF50',
                    font: { color: '#333333', family: 'Inter, sans-serif', size: 12 }
                  },
                  text: greenMaterialData.values.map(value => `${value}%`),
                  textposition: 'outside',
                  textfont: {
                    size: 14,
                    color: '#333333',
                    family: 'Inter, sans-serif',
                    weight: 'bold'
                  },
                  cliponaxis: false
                }
              ]}
              layout={{
                height: 350,
                margin: { l: 40, r: 20, t: 30, b: 60 },
                yaxis: {
                  title: '% of Green Materials',
                  range: [0, 110], // Extended to make room for labels
                  gridcolor: 'rgba(208,208,208,0.5)',
                  tickfont: { color: '#333333', size: 12 },
                  titlefont: { color: '#333333', size: 14 },
                  showgrid: true,
                  zeroline: false
                },
                xaxis: {
                  gridcolor: 'rgba(208,208,208,0.3)',
                  tickfont: { color: '#333333', size: 12, weight: 'bold' },
                  tickangle: -45
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                bargap: 0.4,
                shapes: [{
                  type: 'line',
                  x0: -0.5,
                  y0: 50,
                  x1: greenMaterialData.projects.length - 0.5,
                  y1: 50,
                  line: {
                    color: 'rgba(148,163,184,0.7)',
                    width: 2,
                    dash: 'dash'
                  }
                }],
                annotations: [{
                  x: greenMaterialData.projects.length - 0.5,
                  y: 52,
                  xref: 'x',
                  yref: 'y',
                  text: 'Target (50%)',
                  showarrow: false,
                  font: {
                    family: 'Inter, sans-serif',
                    size: 12,
                    color: 'rgba(148,163,184,1)'
                  },
                  bgcolor: 'rgba(255,255,255,0.7)',
                  borderpad: 4
                }]
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
          </div>
        </div>
        
        {/* ESG Rating Distribution Chart with Flat Colors */}
        <div className="p-6 rounded-2xl bg-white shadow-md">
          <div className="font-medium flex items-center mb-4 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <span>
              ESG Rating Distribution
            </span>
          </div>
          <div className="mt-2">
            <Plot
              data={[
                {
                  type: 'pie',
                  values: esgRatingData.counts,
                  labels: esgRatingData.ratings,
                  hole: 0.5,
                  marker: {
                    colors: [
                      '#4CAF50', // A+ - green
                      '#8BC34A', // A - light green
                      '#FFEB3B', // B+ - yellow
                      '#FFC107', // B - amber
                      '#FF9800', // C - orange
                      '#F44336'  // D - red
                    ],
                    line: {
                      color: 'white',
                      width: 2
                    }
                  },
                  textinfo: 'none',
                  automargin: true,
                  hoverinfo: 'label+value+percent',
                  hovertemplate: '<b>%{label}</b>: %{value}<extra></extra>',
                  hoverlabel: {
                    bgcolor: 'white',
                    bordercolor: '#e2e8f0',
                    font: { color: '#333333', family: 'Inter, sans-serif', size: 12 }
                  },
                  pull: 0,
                  direction: 'clockwise',
                  sort: false
                }
              ]}
              layout={{
                height: 350,
                margin: { l: 20, r: 20, t: 30, b: 60 },
                showlegend: true,
                legend: {
                  orientation: 'h',
                  xanchor: 'center',
                  yanchor: 'bottom',
                  x: 0.5,
                  y: -0.15,
                  font: { color: '#333333', size: 12 },
                  bgcolor: 'white',
                  bordercolor: '#e2e8f0',
                  borderwidth: 1
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                annotations: [
                  {
                    font: { size: 16, color: '#333333', family: 'Inter, sans-serif', weight: 'bold' },
                    showarrow: false,
                    text: 'ESG<br>Ratings',
                    x: 0.5,
                    y: 0.5,
                    align: 'center'
                  },
                  ...esgRatingData.ratings.map((rating, i) => ({
                    text: `${rating}: ${esgRatingData.counts[i]}`,
                    font: { size: 12, color: '#333333' },
                    showarrow: false,
                    x: 0.5,
                    y: 0.5,
                    xanchor: 'center',
                    yanchor: 'bottom',
                    visible: false
                  }))
                ]
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
      
      {/* Project Sustainability Scores Table with Gradient Styling */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#f9f9ff] to-[#e8fdf5] shadow-md">
        <div className="font-medium flex items-center mb-4 text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Project Sustainability Scores
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 rounded-lg">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b-2 border-gradient-to-r from-[#00C9FF] to-[#92FE9D]">
                  Project ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b-2 border-gradient-to-r from-[#00C9FF] to-[#92FE9D]">
                  Env
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b-2 border-gradient-to-r from-[#00C9FF] to-[#92FE9D]">
                  Soc
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b-2 border-gradient-to-r from-[#00C9FF] to-[#92FE9D]">
                  Gov
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b-2 border-gradient-to-r from-[#00C9FF] to-[#92FE9D]">
                  Overall
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border-b-2 border-gradient-to-r from-[#00C9FF] to-[#92FE9D]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-slate-200">
              {projectScoresData.map((project, index) => (
                <tr key={project.id} className={index % 2 === 0 ? 'bg-white/30' : 'bg-slate-50/30'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{project.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GradientScoreBar value={project.env} gradientFrom="#56ab2f" gradientTo="#a8e063" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GradientScoreBar value={project.soc} gradientFrom="#43cea2" gradientTo="#185a9d" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GradientScoreBar value={project.gov} gradientFrom="#DA22FF" gradientTo="#9733EE" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GradientRatingBadge rating={project.overall} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.status === 'Compliant' ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-[#11998E] to-[#38EF7D] text-white shadow-sm">
                        ✅ Compliant
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-[#F7971E] to-[#FFD200] text-slate-800 shadow-sm">
                        ⚠️ Under Review
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GradientKpiCard({
  label, 
  value, 
  description, 
  gradientFrom,
  gradientTo,
  textColor,
  icon
}: {
  label: string;
  value: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div 
      className={`p-6 rounded-2xl border-0 transition-all hover:shadow-lg hover:translate-y-[-3px] flex flex-col items-center text-center ${textColor}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div className="mb-3">
        {icon}
      </div>
      <div className={`text-3xl font-bold mb-2 ${textColor}`}>{value}</div>
      <div className="text-lg font-medium mb-1">{label}</div>
      <div className={`text-sm ${textColor === 'text-white' ? 'text-white/80' : 'text-slate-700'}`}>{description}</div>
    </div>
  );
}

function GradientScoreBar({ value, gradientFrom, gradientTo }: { value: number; gradientFrom: string; gradientTo: string }) {
  return (
    <div className="flex items-center">
      <div className="w-full bg-slate-200 rounded-full h-3 mr-2 overflow-hidden">
        <div 
          className="h-3 rounded-full" 
          style={{ 
            width: `${value}%`,
            background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`
          }}
        ></div>
      </div>
      <span className="text-sm font-medium text-slate-700">{value}</span>
    </div>
  );
}

function GradientRatingBadge({ rating }: { rating: string }) {
  const getBadgeGradient = (rating: string) => {
    switch (rating) {
      case 'A+': return { from: '#11998E', to: '#38EF7D', text: 'text-white' };
      case 'A': return { from: '#56CCF2', to: '#2F80ED', text: 'text-white' };
      case 'B+': return { from: '#F7971E', to: '#FFD200', text: 'text-slate-800' };
      case 'B': return { from: '#FCE38A', to: '#F38181', text: 'text-slate-800' };
      case 'C': return { from: '#FF416C', to: '#FF4B2B', text: 'text-white' };
      case 'D': return { from: '#B06AB3', to: '#4568DC', text: 'text-white' };
      default: return { from: '#E0E0E0', to: '#C0C0C0', text: 'text-slate-800' };
    }
  };

  const gradient = getBadgeGradient(rating);

  return (
    <span 
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${gradient.text} shadow-sm`}
      style={{
        background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`
      }}
    >
      {rating}
    </span>
  );
}
