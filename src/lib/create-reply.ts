import { APROXIMATE_MOUNTHS_IN_LIVE, APROXIMATE_WEEKS_IN_LIVE } from '@/main';

export const createBaseInfoReply = (monthsPassed: number, weeksPassed: number) => {
  return `
🎉 *Ваш жизненный путь* 🎉\n
📅 Вы уже прожили:
*${monthsPassed}* месяцев  
*${weeksPassed}* недель  
      
⏳ Вам примерно осталось:
*${APROXIMATE_MOUNTHS_IN_LIVE - monthsPassed}* месяцев  
*${APROXIMATE_WEEKS_IN_LIVE - weeksPassed}* недель  
      
📊 *Прогресс жизни:*  
\`${'█'.repeat(Math.floor((monthsPassed / APROXIMATE_MOUNTHS_IN_LIVE) * 20))}${'░'.repeat(
    20 - Math.floor((monthsPassed / APROXIMATE_MOUNTHS_IN_LIVE) * 20)
  )}\`  
${monthsPassed}/${APROXIMATE_MOUNTHS_IN_LIVE} месяцев
${weeksPassed}/${APROXIMATE_WEEKS_IN_LIVE} недель`;
};

export const createWeaklyReportReply = (monthsPassed: number, weeksPassed: number) => {
  return `
📢 *Очередная неделя позади!* 📢\n
⏳ Время не стоит на месте! С момента вашего рождения прошла еще *1* неделя.

📊 *Жизненный прогресс:*  
\`${'█'.repeat(Math.floor((monthsPassed / APROXIMATE_MOUNTHS_IN_LIVE) * 20))}${'░'.repeat(
    20 - Math.floor((monthsPassed / APROXIMATE_MOUNTHS_IN_LIVE) * 20)
  )}\`  
${monthsPassed}/${APROXIMATE_MOUNTHS_IN_LIVE} месяцев  
${weeksPassed}/${APROXIMATE_WEEKS_IN_LIVE} недель  

🔥 Используйте каждую неделю с пользой! Помните, что время — самый ценный ресурс.  
🚀 Вперед к новым свершениям!`;
};
