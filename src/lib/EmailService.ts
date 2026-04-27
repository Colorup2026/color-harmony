import emailjs from 'emailjs-com';

export interface EmailData {
  userName: string;
  userEmail: string;
  season: string;
  profileText: string;
  palette: { name: string; hex: string }[];
  clothingSuggestions: { item: string; reason: string }[];
  tips: string[];
}

const SERVICE_ID = 'service_colorup';
const PUBLIC_KEY = '39RAhO8ycBUVCU_zC';
const TEMPLATE_ID = 'template_colorup_results'; // El usuario deberá crear esta plantilla

export const sendResultsEmail = async (data: EmailData) => {
  try {
    // Preparar los datos para la plantilla de EmailJS
    // Convertimos arrays a strings formateados para que se vean bien en el email si no se usa HTML dinámico
    const templateParams = {
      user_name: data.userName,
      user_email: data.userEmail,
      season: data.season,
      profile_text: data.profileText,
      // Formateamos la paleta como una lista de colores
      palette_list: data.palette.map(c => `${c.name} (${c.hex})`).join(', '),
      // Formateamos las prendas
      clothing_list: data.clothingSuggestions.map(s => `- ${s.item}: ${s.reason}`).join('\n'),
      // Formateamos los tips
      tips_list: data.tips.map(t => `• ${t}`).join('\n'),
      // También pasamos los datos crudos por si el usuario usa una plantilla HTML avanzada
      raw_palette: JSON.stringify(data.palette),
      raw_clothing: JSON.stringify(data.clothingSuggestions),
      raw_tips: JSON.stringify(data.tips),
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
