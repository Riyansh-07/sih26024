const natural = require('natural');
const path = require('path');
const trainingData = require('./trainingData');

console.log('🤖 [ML Training] Initializing Naive Bayes Classifier for Grievances...');

const classifier = new natural.BayesClassifier();

// Add all labeled training documents
console.log(`📊 [ML Training] Loading ${trainingData.length} labeled training documents...`);
trainingData.forEach((doc) => {
  classifier.addDocument(doc.text, doc.category);
});

// Train the classifier
console.log('⏳ [ML Training] Training classifier model...');
classifier.train();
console.log('✅ [ML Training] Model training completed.');

// Save trained classifier to server/ml/classifier.json
const outputPath = path.join(__dirname, 'classifier.json');

classifier.save(outputPath, (err) => {
  if (err) {
    console.error('❌ [ML Training] Failed to save classifier model:', err);
    process.exit(1);
  }
  console.log(`💾 [ML Training] Trained classifier successfully saved to: ${outputPath}`);

  // Quick verification inferences
  console.log('\n🧪 [ML Training] Verification Inferences on Test Phrases:');
  const testSamples = [
    'My overtime wages for Sunday night shift have not been paid',
    'Dangerous roof rock cracks near coal seam face',
    'Heavy coal dust and smoke polluting nearby village water stream',
    'Colliery rest shelter needs clean drinking water and ceiling fans',
  ];

  testSamples.forEach((sample) => {
    const predicted = classifier.classify(sample);
    console.log(`  • "${sample}" → [${predicted}]`);
  });

  console.log('\n🎉 [ML Training] Model ready for production categorization!');
});
