require('dotenv').config();
const mongoose = require('mongoose');
const { fakerEN_IN, faker } = require('@faker-js/faker');
const Mine = require('./models/Mine');
const Inspection = require('./models/Inspection');
const Grievance = require('./models/Grievance');

const SUBSIDIARIES_DATA = [
  {
    subsidiary: 'BCCL',
    state: 'Jharkhand',
    districts: ['Dhanbad', 'Bokaro'],
    namePrefixes: ['Jharia', 'Moonidih', 'Kusunda', 'Katras', 'Lodna', 'Bhalgora', 'Bastacolla', 'Sijua', 'Govindpur', 'Block II Colliery'],
  },
  {
    subsidiary: 'CCL',
    state: 'Jharkhand',
    districts: ['Ranchi', 'Bokaro', 'Ramgarh', 'Hazaribagh', 'Latehar'],
    namePrefixes: ['Piprawar', 'Ashok', 'Amrapali', 'Magadh', 'North Karanpura', 'Kathara', 'Argada', 'Rajrappa', 'Kuju', 'Barkakana'],
  },
  {
    subsidiary: 'ECL',
    state: 'West Bengal',
    districts: ['Paschim Bardhaman', 'Purulia', 'Birbhum'],
    namePrefixes: ['Raniganj', 'Sodepur', 'Salanpur', 'Kajora', 'Pandaveswar', 'Mugma', 'Jhanjra', 'Kunustoria', 'Satgram', 'Bankola'],
  },
  {
    subsidiary: 'SECL',
    state: 'Chhattisgarh',
    districts: ['Korba', 'Raigarh', 'Surajpur', 'Koriya', 'Bilaspur'],
    namePrefixes: ['Gevra', 'Kusmunda', 'Dipka', 'Manikpur', 'Chirimiri', 'Bhatgaon', 'Hasdeo', 'Sohagpur', 'Jamuna-Kotma', 'Johilla'],
  },
  {
    subsidiary: 'MCL',
    state: 'Odisha',
    districts: ['Jharsuguda', 'Angul', 'Sundargarh', 'Sambalpur'],
    namePrefixes: ['Talcher', 'Ib Valley', 'Bhubaneswari', 'Samaleswari', 'Kalinga', 'Hingula', 'Ananta', 'Bharatpur', 'Lakhanpur', 'Basundhara'],
  },
  {
    subsidiary: 'NCL',
    state: 'Madhya Pradesh',
    districts: ['Singrauli', 'Anuppur', 'Shahdol'],
    namePrefixes: ['Jayant', 'Dudhichua', 'Nigahi', 'Bina', 'Khadia', 'Amlori', 'Jhingurdah', 'Kakri', 'Krishnashila', 'Gorbi'],
  },
  {
    subsidiary: 'WCL',
    state: 'Maharashtra',
    districts: ['Chandrapur', 'Nagpur', 'Yavatmal'],
    namePrefixes: ['Chandrapur', 'Majri', 'Ballarpur', 'Wani', 'Umrer', 'Kamptee', 'Sasti', 'Durgapur', 'Ghughus', 'Niljai'],
  },
  {
    subsidiary: 'NEC',
    state: 'Jharkhand',
    districts: ['Dhanbad', 'Ranchi', 'Hazaribagh'],
    namePrefixes: ['Tikirak', 'Baragolai', 'Tipong', 'Ledo', 'Margherita North'],
  },
];

const COAL_GRADES = [
  'G3 (Non-Coking)',
  'G4 (Thermal High Grade)',
  'G5 (Semi-Coking)',
  'G6 (Steam Grade)',
  'G7 (High Calorific)',
  'G8 (Industrial Grade)',
  'G11 (Power Sector Grade)',
  'G13 (Thermal Blend)',
  'Steel Grade-I (Coking)',
  'Washery Grade-II (Coking)',
  'Washery Grade-III',
];

const INSPECTION_FINDINGS = [
  'Haul road dust suppression sprinkler systems functioning normally; water spraying logs verified up to date.',
  'DGMS safety guidelines compliance verified. Slope stability monitoring radar installed on north highwall bench.',
  'Underground ventilation auxiliary fan inspection completed. Methane levels well below statutory threshold (0.2%).',
  'Secondary bench slope angle in pit section 4 exceeds recommended 45 degrees; immediate bench dressing required.',
  'Heavy Earth Moving Machinery (HEMM) proximity warning devices and seat belt interlocks inspected and certified.',
  'Afforestation and green belt buffer zone sapling survival rate recorded at 88%; topsoil preservation compliant.',
  'Mine runoff water treatment sedimentation ponds cleared; pH level 7.2 within CPCB statutory limits.',
  'Explosive magazine license, lightning arrestor grounding, and digital CCTV surveillance feed verified active.',
  'Roof bolting load cell testing in main dip heading within acceptable tension limits (6-8 tonnes).',
  'Ambient air PM10 & PM2.5 monitoring stations data synced with State Pollution Control Board portal.',
  'Emergency evacuation drill conducted for shift B miners; rescue breathing apparatus tested and ready.',
  'Conveyor belt fire detection sensors and pull-cord trip mechanisms tested and fully responsive.',
  'Minor oil seepage detected near HEMM maintenance bay. Oil-water separator cleanup ordered within 48h.',
  'Illumination survey in opencast excavation pit compliant with DGMS minimum lux standard (15-30 lux).',
  'Continuous Ambient Air Quality Monitoring Station (CAAQMS) calibration verified by third-party audit.',
  'Gas monitoring telemetry system functional with battery backup; emergency siren test completed.',
];

const MINE_SUFFIXES = [
  'Open Cast Project',
  'OCP Phase-II',
  'Colliery',
  'Underground Mine',
  'Coal Mine Expansion',
  'Deep Seam Project',
  'Integrated Mine Project',
];

const GRIEVANCE_SAMPLES = [
  { category: 'safety', description: 'Defective respirator masks and ear protection provided for drilling crew; replacement needed.' },
  { category: 'working-conditions', description: 'Inadequate potable drinking water and rest shelter facilities at South Pit excavation site.' },
  { category: 'compensation', description: 'Delay in monthly hazardous duty and overtime allowance disbursement for shift operators.' },
  { category: 'environment', description: 'Excessive fugitive coal dust near residential township due to lack of water tanker spraying.' },
  { category: 'safety', description: 'Poor lighting at the coal handling plant (CHP) loading point causing nighttime hazard.' },
  { category: 'working-conditions', description: 'Underground ventilation fans malfunctioning intermittently during peak afternoon shifts.' },
  { category: 'compensation', description: 'Discrepancy in digital biometric attendance logs affecting statutory bonus calculations.' },
  { category: 'other', description: 'Request for scheduled medical health checkup and spirometry testing for dust-exposed workers.' },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
    console.error('❌ Error: Valid MONGO_URI not found in server/.env.');
    console.error('Please update server/.env with your real MongoDB Atlas connection string before seeding.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.');

    // Clear existing data
    console.log('🧹 Clearing existing Mine, Inspection, and Grievance collections...');
    await Mine.deleteMany({});
    await Inspection.deleteMany({});
    await Grievance.deleteMany({});
    console.log('✅ Collections cleared.');

    // Generate 25 realistic Mine documents
    console.log('⛏️ Generating 25 realistic Mine documents...');
    const generatedMines = [];
    const usedNames = new Set();

    for (let i = 0; i < 25; i++) {
      const subInfo = SUBSIDIARIES_DATA[i % SUBSIDIARIES_DATA.length];
      const prefix = subInfo.namePrefixes[Math.floor(Math.random() * subInfo.namePrefixes.length)];
      const suffix = MINE_SUFFIXES[Math.floor(Math.random() * MINE_SUFFIXES.length)];
      
      let mineName = `${prefix} ${suffix}`;
      let counter = 1;
      while (usedNames.has(mineName)) {
        mineName = `${prefix} ${suffix} Block-${counter}`;
        counter++;
      }
      usedNames.add(mineName);

      const district = subInfo.districts[Math.floor(Math.random() * subInfo.districts.length)];
      const type = Math.random() > 0.35 ? 'opencast' : 'underground';
      const statusWeights = ['active', 'active', 'active', 'under-maintenance', 'closed'];
      const operationalStatus = statusWeights[Math.floor(Math.random() * statusWeights.length)];
      const coalGrade = COAL_GRADES[Math.floor(Math.random() * COAL_GRADES.length)];
      const capacityMtpa = parseFloat((Math.random() * 25 + 0.5).toFixed(2));

      generatedMines.push({
        name: mineName,
        location: {
          state: subInfo.state,
          district: district,
        },
        type: type,
        coalGrade: coalGrade,
        capacityMtpa: capacityMtpa,
        operationalStatus: operationalStatus,
        subsidiary: subInfo.subsidiary,
      });
    }

    const createdMines = await Mine.insertMany(generatedMines);
    console.log(`✅ Successfully seeded ${createdMines.length} mines.`);

    // Generate 2-7 inspections per mine
    console.log('📋 Generating 2-7 inspections per mine...');
    const generatedInspections = [];
    const inspectionTypes = ['safety', 'environmental', 'statutory'];
    const inspectionStatuses = ['passed', 'passed', 'pending', 'follow-up-required', 'failed'];
    const severityLevels = ['minor', 'major', 'critical'];

    for (const mine of createdMines) {
      const inspectionCount = faker.number.int({ min: 2, max: 7 });

      for (let j = 0; j < inspectionCount; j++) {
        const inspectorName = `${fakerEN_IN.person.firstName()} ${fakerEN_IN.person.lastName()}`;
        const inspectionType = inspectionTypes[Math.floor(Math.random() * inspectionTypes.length)];
        const status = inspectionStatuses[Math.floor(Math.random() * inspectionStatuses.length)];
        const severity = (status === 'failed' || status === 'follow-up-required')
          ? severityLevels[Math.floor(Math.random() * severityLevels.length)]
          : (Math.random() > 0.6 ? 'minor' : undefined);
        const findings = INSPECTION_FINDINGS[Math.floor(Math.random() * INSPECTION_FINDINGS.length)];
        const date = faker.date.past({ years: 1.5 });

        generatedInspections.push({
          mineId: mine._id,
          inspectorName: inspectorName,
          date: date,
          type: inspectionType,
          findings: findings,
          status: status,
          severity: severity,
        });
      }
    }

    const createdInspections = await Inspection.insertMany(generatedInspections);
    console.log(`✅ Successfully seeded ${createdInspections.length} inspections across ${createdMines.length} mines.`);

    // Generate 1-4 grievances for select mines
    console.log('📢 Generating sample Grievances...');
    const generatedGrievances = [];
    const grievanceStatuses = ['submitted', 'in-review', 'resolved', 'rejected'];

    for (const mine of createdMines) {
      const grievanceCount = faker.number.int({ min: 1, max: 4 });
      for (let g = 0; g < grievanceCount; g++) {
        const sample = GRIEVANCE_SAMPLES[Math.floor(Math.random() * GRIEVANCE_SAMPLES.length)];
        const submitterName = `${fakerEN_IN.person.firstName()} ${fakerEN_IN.person.lastName()}`;
        const gStatus = grievanceStatuses[Math.floor(Math.random() * grievanceStatuses.length)];
        const dateSubmitted = faker.date.past({ years: 1 });
        const dateResolved = gStatus === 'resolved' || gStatus === 'rejected' ? faker.date.recent({ days: 30 }) : undefined;

        generatedGrievances.push({
          mineId: mine._id,
          submittedBy: submitterName,
          category: sample.category,
          description: sample.description,
          status: gStatus,
          dateSubmitted: dateSubmitted,
          dateResolved: dateResolved,
        });
      }
    }

    const createdGrievances = await Grievance.insertMany(generatedGrievances);
    console.log(`✅ Successfully seeded ${createdGrievances.length} grievances.`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary: ${createdMines.length} Mines | ${createdInspections.length} Inspections | ${createdGrievances.length} Grievances`);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();
