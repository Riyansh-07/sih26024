/**
 * Training Dataset for Coal Mine Grievance Classification
 * 
 * Contains 80 realistic domain-specific examples (20 per category)
 * covering authentic terminology, complaints, and situations from Indian coal fields
 * (BCCL, CCL, ECL, SECL, MCL, WCL, NCL, NEC) and DGMS regulatory context.
 * 
 * Categories:
 *  - Wages: Payroll, overtime, allowances, bonus, arrears, pay revision, deductions, CMPF.
 *  - Safety: Roof stability, ventilation, gas detection, DGMS compliance, PPE, machinery safety, blasting hazards.
 *  - Environmental: Dust emissions, water discharge, nallah pollution, blasting vibrations, afforestation, ETP.
 *  - General: Sanitation, drinking water, housing quarters, canteen, transport, administrative procedures.
 */

const trainingData = [
  // =========================================================================
  // 1. WAGES & COMPENSATION (20 Examples)
  // =========================================================================
  {
    text: "Delay in disbursement of arrears from the latest National Coal Wage Agreement revision.",
    category: "Wages",
  },
  {
    text: "Underground risk allowance and difficult seam pay have not been credited in this month's payslip.",
    category: "Wages",
  },
  {
    text: "Overtime hours worked during the emergency breakdown of shovel 04 were omitted from payroll.",
    category: "Wages",
  },
  {
    text: "Discrepancy in monthly Coal Mines Provident Fund (CMPF) ledger deduction and statement balance.",
    category: "Wages",
  },
  {
    text: "Annual Performance Linked Reward (PLR) festival bonus calculation incorrect for category-II fitters.",
    category: "Wages",
  },
  {
    text: "Superannuation terminal gratuity and leave encashment benefits pending clearance for four months.",
    category: "Wages",
  },
  {
    text: "Biometric attendance scanner at pit head failed, causing deduction of half-day salary for shift B.",
    category: "Wages",
  },
  {
    text: "Medical reimbursement claims for emergency hospitalization submitted in June are still unapproved.",
    category: "Wages",
  },
  {
    text: "Acting charge allowance for supervising the coal handling plant during night shifts not disbursed.",
    category: "Wages",
  },
  {
    text: "Sunday statutory working double wages missing from the direct bank transfer for drill operators.",
    category: "Wages",
  },
  {
    text: "Contract labor contractor has withheld weekly wages for 30 surface dumper cleaning workers.",
    category: "Wages",
  },
  {
    text: "Variable Dearness Allowance (VDA) quarterly rate increase was not applied to our recent payment.",
    category: "Wages",
  },
  {
    text: "Heavy Earth Moving Machinery operator special duty allowance stopped without prior notice.",
    category: "Wages",
  },
  {
    text: "Hard duty allowance for continuous operation in dusty opencast pit benches not credited.",
    category: "Wages",
  },
  {
    text: "Retrospective pay grade fixation after clearing departmental trade test remains unimplemented.",
    category: "Wages",
  },
  {
    text: "Earned leave encashment application submitted prior to LTC travel has not been credited.",
    category: "Wages",
  },
  {
    text: "Annual increment withheld despite satisfactory annual confidential appraisal report.",
    category: "Wages",
  },
  {
    text: "Incorrect tax deduction at source (TDS) computed on monthly overtime remuneration.",
    category: "Wages",
  },
  {
    text: "Target incentive bonus for exceeding monthly dispatch quota at rail siding not distributed.",
    category: "Wages",
  },
  {
    text: "Subsistence allowance during inquiry proceedings has been delayed for over sixty days.",
    category: "Wages",
  },

  // =========================================================================
  // 2. SAFETY & HAZARDS (20 Examples)
  // =========================================================================
  {
    text: "Visible tension cracks observed along the top edge of the north overburden dump after recent rain.",
    category: "Safety",
  },
  {
    text: "Multi-gas detector sensor calibration expired; methane monitoring in bottom seam compromised.",
    category: "Safety",
  },
  {
    text: "Highwall bench width in sector 4 is narrower than DGMS safety regulations, posing rockfall risk.",
    category: "Safety",
  },
  {
    text: "Roll-Over Protection Structure (ROPS) damaged on 85-tonne haul dumper operating in main pit.",
    category: "Safety",
  },
  {
    text: "Underground cap lamp batteries failing halfway through shift, leaving miners in darkness at coal face.",
    category: "Safety",
  },
  {
    text: "Loose rock strata and inadequate roof bolting density identified along the main haulage drive junction.",
    category: "Safety",
  },
  {
    text: "Auxiliary ventilation flexible ducting torn in deep heading resulting in stagnant air and heat buildup.",
    category: "Safety",
  },
  {
    text: "Fire extinguisher cylinders at the central diesel refueling station are overdue for hydrostatic test.",
    category: "Safety",
  },
  {
    text: "Rear-end collision radar and operator fatigue monitoring cameras non-functional on dumper fleet.",
    category: "Safety",
  },
  {
    text: "Emergency pull-cord trip wire switch disconnected along the main trunk conveyor to the crusher.",
    category: "Safety",
  },
  {
    text: "Incline man-riding car track has buckled sleepers near 3-dip level, causing severe derailment danger.",
    category: "Safety",
  },
  {
    text: "Blasting danger zone safety siren not audible near the southern perimeter during afternoon round.",
    category: "Safety",
  },
  {
    text: "Self-Contained Self-Rescuers (SCSR) issued to underground shift lack valid inspection seal tags.",
    category: "Safety",
  },
  {
    text: "Severe hydraulic oil leak near the turbocharger of shovel machine creates continuous fire hazard.",
    category: "Safety",
  },
  {
    text: "Bottom excavation sump water rising rapidly towards high-voltage mobile electrical substation.",
    category: "Safety",
  },
  {
    text: "Supplied safety shoes and dust respirators are defective and do not meet statutory ISI specifications.",
    category: "Safety",
  },
  {
    text: "33kV overhead electric transmission lines sagging below minimum clearance over the haul road.",
    category: "Safety",
  },
  {
    text: "Poor pit illumination during night shifts below the 15-lux minimum standard prescribed by DGMS.",
    category: "Safety",
  },
  {
    text: "Emergency engine shut-off switch on primary coal feeder breaker is jammed and inoperable.",
    category: "Safety",
  },
  {
    text: "Large overhanging boulders on top bench have not been dressed down before excavator deployment.",
    category: "Safety",
  },

  // =========================================================================
  // 3. ENVIRONMENTAL & ECOLOGY (20 Examples)
  // =========================================================================
  {
    text: "Heavy emission of dense black diesel exhaust smoke from unserviced generator sets at rail siding.",
    category: "Environmental",
  },
  {
    text: "Acidic mine sump drainage being discharged directly into the local stream without lime neutralization.",
    category: "Environmental",
  },
  {
    text: "Fugitive coal dust from dry haul roads continuously blanketing adjacent village agricultural farms.",
    category: "Environmental",
  },
  {
    text: "Automated mist sprinkler pipeline along the coal transport corridor is broken and dry for ten days.",
    category: "Environmental",
  },
  {
    text: "Excessive ground vibrations and flyrock from heavy production blasting causing wall cracks in colony.",
    category: "Environmental",
  },
  {
    text: "Topsoil stripped from new pit area dumped with rocky waste instead of being stored on topsoil berm.",
    category: "Environmental",
  },
  {
    text: "Effluent Treatment Plant (ETP) oil and grease separator overflowed into the boundary rainwater drain.",
    category: "Environmental",
  },
  {
    text: "Continuous Ambient Air Quality Monitoring Station (CAAQMS) shows PM10 levels exceeding CPCB limits.",
    category: "Environmental",
  },
  {
    text: "Fly ash slurry pipeline from captive power plant leaking into surrounding forest catchment area.",
    category: "Environmental",
  },
  {
    text: "Windbreak green netting around primary coal stockpile torn, allowing strong winds to scatter coal fines.",
    category: "Environmental",
  },
  {
    text: "Spontaneous heating and smoldering fires on old coal seam outcrop releasing toxic sulfur dioxide fumes.",
    category: "Environmental",
  },
  {
    text: "Coal delivery highway trucks departing dispatch weighbridge without mandatory tarpaulin covers.",
    category: "Environmental",
  },
  {
    text: "Lack of peripheral garland drains and settling ponds causing heavy silt runoff into nearby water reservoir.",
    category: "Environmental",
  },
  {
    text: "Deep mine dewatering without artificial groundwater recharge has dried up surrounding village borewells.",
    category: "Environmental",
  },
  {
    text: "Heavy oil contamination found in soil around the HEMM workshop washing and maintenance ramp.",
    category: "Environmental",
  },
  {
    text: "Mandatory compensatory afforestation tree saplings on reclaimed dump slope have 70% mortality rate.",
    category: "Environmental",
  },
  {
    text: "Turbid mine discharge water overflowing sedimentation tanks during heavy monsoon cloudburst.",
    category: "Environmental",
  },
  {
    text: "Blasting dust plumes traveling towards residential quarters due to lack of wet drilling suppressors.",
    category: "Environmental",
  },
  {
    text: "Disposed lead-acid equipment batteries and discarded chemical drums dumped unsegregated behind shed.",
    category: "Environmental",
  },
  {
    text: "Unplanned overburden dumping has blocked natural rainwater nallah causing waterlogging upstream.",
    category: "Environmental",
  },

  // =========================================================================
  // 4. GENERAL, AMENITIES & WELFARE (20 Examples)
  // =========================================================================
  {
    text: "Potable cold drinking water filtration unit at the pit head muster station is out of order.",
    category: "General",
  },
  {
    text: "Colliery canteen meals are poor quality, unhygienic, and unavailable during graveyard shift hours.",
    category: "General",
  },
  {
    text: "Rest shelter shed at quarry bench 2 has collapsed roofing and lacks benches or ceiling fans.",
    category: "General",
  },
  {
    text: "Female staff sanitation blocks and changing rooms at the time office are locked and dirty.",
    category: "General",
  },
  {
    text: "Main residential colony approach road full of severe potholes, damaging worker transport buses.",
    category: "General",
  },
  {
    text: "Allotment of designated type-III staff quarters pending despite vacancy and senior entitlement.",
    category: "General",
  },
  {
    text: "Annual monsoon uniform kit, gumboots, and raincoats have not been distributed to surface workers.",
    category: "General",
  },
  {
    text: "Colliery dispensary frequently lacks basic emergency medicines, first aid dressing, and ambulance.",
    category: "General",
  },
  {
    text: "Street lighting non-functional across sector B residential colony lanes creating security concerns.",
    category: "General",
  },
  {
    text: "Discrepancy in provisional seniority ranking list published for departmental promotional exam.",
    category: "General",
  },
  {
    text: "Childcare creche facility near administrative complex lacks trained attendants and drinking water.",
    category: "General",
  },
  {
    text: "Severe roof seepage and wall dampness in staff quarter block 12 requires urgent civil maintenance.",
    category: "General",
  },
  {
    text: "Delays in issuing digital smart identity cards for newly recruited technical trainees.",
    category: "General",
  },
  {
    text: "Transfer application on compassionate medical grounds pending with regional personnel manager.",
    category: "General",
  },
  {
    text: "VHF wireless communication sets between pit office and dispatch control room constantly faulty.",
    category: "General",
  },
  {
    text: "Colliery ambulance was unavailable during recent night shift emergency due to flat tire.",
    category: "General",
  },
  {
    text: "Sanitation spraying and vector control measures not conducted in staff barracks ahead of monsoon.",
    category: "General",
  },
  {
    text: "Shift worker transport bus regularly arrives 45 minutes late, disrupting shift handover at pithead.",
    category: "General",
  },
  {
    text: "Recreational community center and sports ground in miners colony lying in neglected state.",
    category: "General",
  },
  {
    text: "Application for compassionate appointment under statutory clause 9.4.0 pending verification for months.",
    category: "General",
  },
];

module.exports = trainingData;
