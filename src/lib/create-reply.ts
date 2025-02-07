import { APROXIMATE_MOUNTHS_IN_LIVE, APROXIMATE_WEEKS_IN_LIVE } from '@/main';

export const createReply = (monthsPassed: number, weeksPassed: number) => {
  return `
🎉 *Ваш жизненный путь* 🎉\n
📅 Вы уже прожили:
*${monthsPassed}* месяцев  
*${weeksPassed}* недель  
      
⏳ Вам осталось:
*${APROXIMATE_MOUNTHS_IN_LIVE - monthsPassed}* месяцев  
*${APROXIMATE_WEEKS_IN_LIVE - weeksPassed}* недель  
      
📊 *Прогресс жизни:*  
\`${'█'.repeat(Math.floor((monthsPassed / APROXIMATE_MOUNTHS_IN_LIVE) * 20))}${'░'.repeat(
    20 - Math.floor((monthsPassed / APROXIMATE_MOUNTHS_IN_LIVE) * 20)
  )}\`  
${monthsPassed}/${APROXIMATE_MOUNTHS_IN_LIVE} месяцев
${weeksPassed}/${APROXIMATE_WEEKS_IN_LIVE} недель
      
⏰ Каждый понедельник прибавляется 1 неделя`;
};
