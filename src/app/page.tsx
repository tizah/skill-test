"use client"
import React, { useEffect, useState, useRef } from 'react'
import Nav from '../components/nav'
import Image from 'next/image';
import MyChart from '@/components/MyChart';
import DiagnosticCard from '@/components/DiagnosticCard';
import DiagnosticList from '@/components/DiagnosticList';
import query from '../services/query/patients'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Patient, { ListOfDiagnosis, PatientProps } from '@/components/Patient';
import moment from 'moment';
import LabResult from '@/components/LabResult';
import Dropdown from '@/components/MonthsDropdown';

const bloodPressureIndicator = [
  {
    index: 1,
    level: 'Higher than Average',
    svg: '/ArrowUp.svg'
  },
  {
    index: 2,
    level: 'Lower than Average',
    svg: '/ArrowDown.svg'
  },
  {
    index: 3,
    level: 'Normal',
    svg: ''
  },
]


const HomePage = () => {
  const { data } = query.useRead();
  const JessicaTaylorRecords = data.find((p: any) => p.name === "Jessica Taylor");

  const [selectedPatient, setSelectedPatient] = useState<PatientProps>(JessicaTaylorRecords);

  const [selectedRange, setSelectedRange] = useState('6months');
  const [filteredData, setFilteredData] = useState<{
    labels: string[], diastolicValues: number[], systolicValues: number[]
  } | null>(null);
  const [patientLatestResults, setPatientLatestResults] = useState<any>();




  const extractBloodPressureData = (diagnosticHistory: any) => {
    const labels: string[] = [];
    const systolicValues: number[] = [];
    const diastolicValues: number[] = [];

    diagnosticHistory?.forEach((entry: any) => {
      const label: any = `${entry.month?.substring(0, 3)} ${entry.year}`;
      labels.push(label);
      systolicValues.push(entry.blood_pressure.systolic.value);
      diastolicValues.push(entry.blood_pressure.diastolic.value);
    });

    return {
      labels,
      systolicValues,
      diastolicValues
    };
  }

  useEffect(() => {
    if (!selectedPatient) {
      setSelectedPatient(JessicaTaylorRecords);
    }
  }, [JessicaTaylorRecords, selectedPatient])

  useEffect(() => {
    if (selectedPatient?.diagnosis_history) {
      setPatientLatestResults(selectedPatient.diagnosis_history[0])
    }
  }, [selectedPatient?.diagnosis_history])

  useEffect(() => {
    if (selectedPatient) {
      const patient = data.find((p: any) => p.name === selectedPatient.name);

      if (patient) {
        const copy = patient.diagnosis_history.slice()
        const reversedHistory = copy.reverse(); // Clone and reverse

        const { labels, systolicValues, diastolicValues } = extractBloodPressureData(reversedHistory);
        setFilteredData({ labels, systolicValues, diastolicValues });
      }
    }
  }, [selectedPatient]);





  useEffect(() => {
    if (selectedPatient) {
      const now = new Date();
      const filterData = (months: any) => {
        const cutoffDate = new Date(now.getFullYear(), now.getMonth() - months - 1, 1);
        return selectedPatient.diagnosis_history?.filter((entry: any, index: number) => {
          const entryDate = new Date(entry.year, new Date(Date.parse(entry.month + " 1, 2022")).getMonth(), 1);
          return entryDate >= cutoffDate;
        });
      };

      let selectedFiltere;
      switch (selectedRange) {
        case '3months':
          selectedFiltere = filterData(3);
          break;
        case '6months':
          selectedFiltere = filterData(6);
          break;
        case '12months':
          selectedFiltere = filterData(12);
          break;
        default:
          selectedFiltere = selectedPatient.diagnosis_history
            ;
          break;
      }


      const copy = selectedFiltere?.slice()
      const reversedselectedFiltere = copy.reverse();

      const { labels, systolicValues, diastolicValues } = extractBloodPressureData(reversedselectedFiltere);


      setFilteredData({ labels, systolicValues, diastolicValues });
    }
  }, [selectedRange, selectedPatient]);

  const chartData = {
    labels: filteredData?.labels,
    datasets: [
      {
        label: 'Systolic',
        fill: false,
        data: filteredData?.systolicValues,
        borderColor: '#E66FD2',
        tension: 0.5,

      },
      {
        label: 'Diastolic',
        fill: false,
        data: filteredData?.diastolicValues,
        borderColor: '#8C6FE6',
        tension: 0.5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20, // Set step size to 20
        },
        grid: {
          display: true, // Show horizontal grid lines
        },
      },
    },
  };





  const getSystolicLevelComponent = (patientLatestResults: any) => {
    const systolicLevel = patientLatestResults;

    const levelInfo = bloodPressureIndicator.find((level) => level.level === systolicLevel);

    if (!levelInfo) {
      return null;
    }

    return (
      <div className="flex space-x-3">
        {levelInfo.svg && <Image src={levelInfo.svg} alt='measurement' height={15} width={15} />}
        <span>{levelInfo.level}</span>
      </div>
    );
  };


  return (
    <main className=" flex min-h-screen flex-col my-6">
      <Nav />
      <div className="grid grid-cols-9 gap-6">
        <div className="bg-white col-span-2  rounded-2xl">
          <div className="flex justify-between items-center mb-3 p-6">
            <div className="text-2xl font-semibold">Patients</div>
            <div className='w-[18px] h-[18px]'>
              <Image src="/search.svg" alt='search icon' width={18} height={18} />
            </div>
          </div>

          <div className="overflow-y-auto h-[900px]">
            {data.map((patient: PatientProps, idx: number) => {
              return <Patient onClick={() => setSelectedPatient(patient)} key={idx} name={patient.name} profile_picture={patient.profile_picture} age={patient.age} gender={patient.gender} selected={patient.name === selectedPatient?.name} />
            })}

          </div>

        </div>
        <div className=" col-span-5">
          <div className="bg-white rounded-2xl p-6  ">
            <span className="text-2xl font-semibold">Diagnostic Test</span>
            <div className="bg-[#F4F0FE] p-3 rounded-2xl flex mt-6">
              <div className='w-[60%]'>
                <div className="flex justify-between">
                  <span className='font-semibold'>Blood Pressure</span>
                  <Dropdown selectedRange={selectedRange} setSelectedRange={setSelectedRange} />
                </div>

                {chartData && <MyChart data={chartData} options={options} />}
              </div>
              <div className="space-y-3">
                <div className="ml-6 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#E66FD2] w-[10px] h-[10px] rounded-full"></div>
                    <span>Systolic</span>
                  </div>

                  <p className="text-4xl font-semibold">{patientLatestResults?.blood_pressure
                    .systolic.value || 0
                  }</p>
                  {getSystolicLevelComponent(patientLatestResults?.blood_pressure
                    .systolic.levels)}


                </div>


                <div className='border w-[280px] ml-6'></div>

                <div className="ml-6 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#8C6FE6] w-[10px] h-[10px] rounded-full"></div>
                    <span>Diastolic</span>
                  </div>

                  <p className="text-4xl font-semibold">{patientLatestResults?.blood_pressure
                    .diastolic.value || 0
                  }</p>
                  {getSystolicLevelComponent(patientLatestResults?.blood_pressure
                    .diastolic.levels)}

                </div>

              </div>

            </div>

            <div className="flex justify-between pt-6">
              <DiagnosticCard color="#E0F3FA" image='/respiratoryRate.png' alt='respiratory' name="Respiratory Rate" measurement={`${patientLatestResults?.respiratory_rate
                .value || 0} bpm`} />
              <DiagnosticCard color="#FFE6E9" image='/temperature.png' alt='temparature' name="Temperature" measurement={`${patientLatestResults?.temperature
                .value || 0} F`} />
              <DiagnosticCard color="#FFE6F1" image='/HeartBPM.png' alt='heart' name="Heart Rate" measurement={`${patientLatestResults?.heart_rate.value || 0} bpm`} />

            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mt-6">
            <p className="text-2xl font-semibold mb-6">Diagnostic List</p>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  rounded-full">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Problem / Diagnostics
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                {selectedPatient?.diagnostic_list?.map((diagnosis: ListOfDiagnosis, idx: number) => {
                  return <DiagnosticList key={idx} name={diagnosis.name} description={diagnosis.description} status={diagnosis.status} />
                })}
              </table>
            </div>
          </div>

        </div>
        <div className=" col-span-2 space-y-6">
          <div className='bg-white rounded-2xl px-6'>
            <div className="flex flex-col justify-center items-center space-y-6 pt-6">
              <Image src={selectedPatient?.profile_picture || ''} alt='search icon' width={200} height={200} />
              <div className="font-semibold">{selectedPatient?.name}</div>
            </div>

            <div className="pt-6">
              <div className="space-y-4">
                <div className='flex text-xs items-center space-x-6'>
                  <div className="">
                    <Image src="/BirthIcon.svg" alt='calendar icon' width={42} height={42} />
                  </div>

                  <div>
                    <p className="">Date Of Birth</p>
                    <p className="font-semibold">{moment(selectedPatient?.date_of_birth).format('MMMM DD, YYYY')}</p>
                  </div>

                </div>

                <div className='flex text-xs items-center space-x-6'>
                  <div >
                    <Image src={selectedPatient?.gender === 'Female' ? '/FemaleIcon.svg' : 'MaleIcon.svg'} alt='calendar icon' width={42} height={42} />
                  </div>

                  <div>
                    <p className="">Gender</p>
                    <p className="font-semibold">{selectedPatient?.gender}</p>
                  </div>

                </div>
                <div className='flex text-xs items-center space-x-6'>
                  <div className="bg-gray-100 w-[42px] h-[42px] p-3 rounded-full  flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>

                  </div>

                  <div>
                    <p className="">Contact info.</p>
                    <p className="font-semibold">{selectedPatient?.phone_number}</p>
                  </div>

                </div>

                <div className='flex text-xs items-center space-x-6'>
                  <div className="bg-gray-100 w-[42px] h-[42px] p-3 rounded-full  flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>

                  </div>

                  <div>
                    <p className="">Emergency Contacts</p>
                    <p className="font-semibold">{selectedPatient?.emergency_contact
                    }</p>
                  </div>

                </div>

                <div className='flex text-xs items-center space-x-6'>
                  <div>
                    <Image src="/InsuranceIcon.svg" alt='calendar icon' width={42} height={42} />
                  </div>

                  <div>
                    <p className="">Insurance Provider</p>
                    <p className="font-semibold">{selectedPatient?.insurance_type
                    }</p>
                  </div>

                </div>


              </div>
              <div className="p-8">
                <button className="bg-[#01F0D0] px-6 py-2 font-semibold rounded-full ">Show All Information</button>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white col-span-2 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <div className="text-2xl font-semibold">Lab Results</div>
              </div>

              <div>
                <div className="">
                  {
                    selectedPatient?.lab_results && selectedPatient?.lab_results.map((name: string, idx) => {
                      return <LabResult key={idx} name={name} />
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


const queryClient = new QueryClient()
export default function Home() {

  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>


  );
}
