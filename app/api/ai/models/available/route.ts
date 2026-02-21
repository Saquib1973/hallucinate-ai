import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch available models');
        }
        const data = await response.json();
        const freeModels = data.data.filter((model: any) => {

            const promptPrice = parseFloat(model?.pricing?.prompt || "0");
            const completionPrice = parseFloat(model?.pricing?.completion || "0");
            return promptPrice === 0 && completionPrice === 0;
        });

        const formatedModel = freeModels.map((model: any) => {
            return {
                id: model.id,
                name: model.name,
                description: model.description,
                context_length: model.context_length,
                architecture: model.architecture,
                pricing: model.pricing,
                top_provider: model.top_provider,
            }
        })
        return NextResponse.json({
            success: true,
            models: formatedModel
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch available models" }, { status: 500 });
    }

}