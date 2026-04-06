import labelsData from '../data/labelsData.json';
import unitNames from '../data/unitNames.json';
import gradeInfo from '../data/gradeInfo.json';
import { type Grade } from '../types';

export const fetchCurriculum = async (): Promise<Grade[]> => {
  const curriculum: Grade[] = [];

  Object.entries(labelsData).forEach(([gradeKey, units]) => {
    const gradeNum = gradeKey.replace("g", "");
    const gradeData: Grade = {
      grade: gradeNum,
      title: (gradeInfo as any)[gradeNum]?.title || `Grade ${gradeNum} Curriculum`,
      units: []
    };

    Object.entries(units).forEach(([unitKey, labels]) => {
      if (labels.length > 0) {
        const unitNum = unitKey.replace("u", "");
        const unitName = (unitNames as any)[gradeKey]?.[unitKey] || "Biological Systems";
        
        gradeData.units.push({
          name: `Unit ${unitNum}: ${unitName}`,
          labels: labels.map((label: any) => ({
            id: `STATIC-${gradeKey}-${unitKey}-${label.file.replace(/\.[^/.]+$/, "")}`,
            title: label.title,
            description: label.description,
            imageUrl: `/labels-img/${gradeKey}/${unitKey}/${label.file}`,
            tags: label.tags
          }))
        });
      }
    });

    if (gradeData.units.length > 0) {
      curriculum.push(gradeData);
    }
  });

  return curriculum;
};
