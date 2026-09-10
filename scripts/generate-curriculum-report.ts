import fs from 'fs';
import path from 'path';
import { ALL_MODULES, ALL_MILESTONES, getAllTasksCount } from '../src/content/modules';

let md = `# PrismaLens 14-Day Production Curriculum Master Report

**Generated At:** ${new Date().toISOString()}  
**Curriculum Version:** 1.0.0 (Production Master)  
**Total Milestones:** ${ALL_MILESTONES.length}  
**Total Days:** ${ALL_MODULES.length}  
**Total Theoretical Concepts:** ${ALL_MODULES.reduce((acc, m) => acc + m.concepts.length, 0)}  
**Total Practice & Challenge Tasks:** ${getAllTasksCount()}  
**Total Estimated Learning Time:** ${ALL_MODULES.reduce((acc, m) => acc + m.estimatedMinutes, 0)} minutes (~${(ALL_MODULES.reduce((acc, m) => acc + m.estimatedMinutes, 0) / 60).toFixed(1)} hours)

---

## 📂 Exported Content JSON Files

All curriculum content has been exported into formatted, standalone JSON files located in two directories:

### 1. Workspace Directory: \`/curriculum-json/\`
- **\`curriculum-full.json\`**: The master dataset containing the entire curriculum (all 14 days, concepts, theory breakdowns, code challenges, test rules, hints, and solutions).
- **\`curriculum-summary.json\`**: An indexed overview of the entire curriculum with days, concepts, task counts, and validation contracts.
- **\`milestones.json\`**: The 4 foundational milestone definitions.
- **\`day-01.json\` through \`day-14.json\`**: 14 modular daily JSON files containing full theory, tasks, and final challenges for that day.

### 2. Web / Public Directory: \`/public/curriculum/\`
- Identical JSON files served statically at \`/curriculum/curriculum-full.json\`, \`/curriculum/day-01.json\`, etc., for API or in-browser consumption.

---

## 🗺️ Milestone Architectural Roadmap

| Milestone | Title & Subtitle | Days Range | Focus & Scope |
|-----------|------------------|------------|---------------|
${ALL_MILESTONES.map(
  (ms) =>
    `| **Milestone ${ms.number}** | **${ms.title}**<br>*${ms.subtitle}* | \`${ms.daysRange}\` | ${ms.description} |`
).join('\n')}

---

## 📊 Curriculum High-Level Inventory

| Day | Module Title | Est. Mins | Concepts | Tasks (Practice + Challenge) | Key Focus Area |
|:---:|:---|:---:|:---:|:---:|:---|
${ALL_MODULES.map((m) => {
  const practiceTasks = m.concepts.reduce((acc, c) => acc + c.tasks.length, 0);
  const challengeTasks = m.challenge?.tasks?.length || 0;
  return `| Day ${m.day.toString().padStart(2, '0')} | **${m.shortTitle}** | ${m.estimatedMinutes}m | ${m.concepts.length} | ${practiceTasks} + ${challengeTasks} = **${practiceTasks + challengeTasks}** | \`${m.slug}\` |`;
}).join('\n')}

---

## 📚 Complete Day-by-Day Syllabus

`;

ALL_MODULES.forEach((mod) => {
  const milestone = ALL_MILESTONES.find((m) => m.id === mod.milestoneId);
  md += `### 📅 Day ${mod.day.toString().padStart(2, '0')}: ${mod.title}\n\n`;
  md += `- **ID / Slug:** \`${mod.id}\` (\`${mod.slug}\`)\n`;
  md += `- **Milestone:** Milestone ${milestone ? milestone.number : '?'}: ${milestone ? milestone.title : mod.milestoneId}\n`;
  md += `- **Estimated Duration:** ${mod.estimatedMinutes} minutes\n`;
  md += `- **Module Overview:** ${mod.description}\n\n`;

  md += `**Key Learning Takeaways:**\n`;
  mod.completionLearnings.forEach((item) => {
    md += `- ✅ ${item}\n`;
  });
  md += `\n`;

  // Concepts
  md += `#### 🧠 Concepts (${mod.concepts.length})\n\n`;
  mod.concepts.forEach((concept, cIdx) => {
    md += `##### Concept ${cIdx + 1}: ${concept.title} (\`${concept.id}\`)\n`;
    md += `> **Overview:** ${concept.shortDescription}\n\n`;
    md += `- **Theory Core:** ${concept.theory.summary}\n`;
    md += `- **Key Takeaway:** *${concept.theory.keyTakeaway}*\n`;
    if (concept.theory.commonMistakes && concept.theory.commonMistakes.length > 0) {
      md += `- **Common Pitfalls:**\n`;
      concept.theory.commonMistakes.forEach((cm) => {
        md += `  - ⚠️ ${cm}\n`;
      });
    }
    if (concept.theory.mcqs && concept.theory.mcqs.length > 0) {
      const q = concept.theory.mcqs[0];
      md += `- **Quick Check MCQ:** *"${q.question}"*\n`;
      md += `  - *Correct Answer:* Option ${q.correctIndex + 1}: "${q.options[q.correctIndex]}"\n`;
      md += `  - *Explanation:* ${q.explanation}\n`;
    }

    md += `\n**Practice Tasks for Concept ${cIdx + 1}:**\n\n`;
    concept.tasks.forEach((task, tIdx) => {
      md += `###### 📝 Task ${cIdx + 1}.${tIdx + 1}: ${task.title} (\`${task.id}\`)\n`;
      md += `- **Type:** \`${task.type}\` | **Target Model:** \`${task.targetModel}\` | **Active Tab:** \`${task.activeTab || 'editor'}\`\n`;
      md += `- **Description:** ${task.description}\n`;
      if (task.instructions && task.instructions.length > 0) {
        md += `- **Instructions & Directives:**\n`;
        task.instructions.forEach((inst) => {
          md += `  - [ ] ${inst}\n`;
        });
      }
      md += `- **Prisma Validation Rule:**\n`;
      md += `  - Method: \`${task.validation.requiredMethod || 'any'}\`\n`;
      if (task.validation.requiredFieldsInSelect) {
        md += `  - Required Select Fields: \`${task.validation.requiredFieldsInSelect.join(', ')}\`\n`;
      }
      if (task.validation.requiredIncludes) {
        md += `  - Required Includes: \`${task.validation.requiredIncludes.join(', ')}\`\n`;
      }
      if (task.validation.requiredWhereClauses) {
        md += `  - Required Where Filters: \`${task.validation.requiredWhereClauses.join(', ')}\`\n`;
      }
      if (task.validation.expectFailure) {
        md += `  - Expected Failure Code: \`${task.validation.expectedErrorCode || 'Error Expected'}\`\n`;
      }
      md += `- **Initial Starter Code:**\n\`\`\`${task.activeTab === 'schema' ? 'prisma' : 'typescript'}\n${task.initialCode}\n\`\`\`\n`;
      md += `- **Solution Code:**\n\`\`\`${task.activeTab === 'schema' ? 'prisma' : 'typescript'}\n${task.solutionCode}\n\`\`\`\n`;
      md += `- **Success Message:** *"${task.successMessage}"*\n\n`;
    });
  });

  // Final Challenge
  if (mod.challenge) {
    md += `#### 🏆 Day ${mod.day} Final Challenge: ${mod.challenge.title} (\`${mod.challenge.id}\`)\n\n`;
    md += `> **Scenario:** ${mod.challenge.scenario}\n\n`;
    md += `**Challenge Tasks (${mod.challenge.tasks.length}):**\n\n`;
    mod.challenge.tasks.forEach((task, chIdx) => {
      md += `###### 🎯 Challenge Task ${chIdx + 1}: ${task.title} (\`${task.id}\`)\n`;
      md += `- **Type:** \`${task.type}\` | **Target Model:** \`${task.targetModel}\` | **Active Tab:** \`${task.activeTab || 'editor'}\`\n`;
      md += `- **Description:** ${task.description}\n`;
      if (task.instructions && task.instructions.length > 0) {
        md += `- **Instructions & Directives:**\n`;
        task.instructions.forEach((inst) => {
          md += `  - [ ] ${inst}\n`;
        });
      }
      md += `- **Initial Starter Code:**\n\`\`\`${task.activeTab === 'schema' ? 'prisma' : 'typescript'}\n${task.initialCode}\n\`\`\`\n`;
      md += `- **Solution Code:**\n\`\`\`${task.activeTab === 'schema' ? 'prisma' : 'typescript'}\n${task.solutionCode}\n\`\`\`\n`;
      md += `- **Success Message:** *"${task.successMessage}"*\n\n`;
    });
  }

  md += `\n---\n\n`;
});

fs.writeFileSync(
  path.resolve(process.cwd(), 'CURRICULUM_REPORT.md'),
  md,
  'utf-8'
);

console.log('Successfully generated CURRICULUM_REPORT.md!');
