/* eslint-env node */
import supabase from "@/lib/supabase"
import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const config = {
  runtime: "edge",
}

const satoshiBold = fetch(new URL("@/styles/Satoshi-Bold.ttf", import.meta.url)).then((res) => res.arrayBuffer())

const interMedium = fetch(new URL("@/styles/Inter-Medium.ttf", import.meta.url)).then((res) => res.arrayBuffer())

export default async function (req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const [satoshiBoldData, interMediumData] = await Promise.all([satoshiBold, interMedium])

  const defaultResult = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
          padding: "80px",
          color: "white",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          backgroundPosition: "-30px -10px",
          backgroundColor: "#030303",
        }}
      >
        <div
          style={{
            fontSize: 80,
            display: "flex",
          }}
        >
          Say{" "}
          <span
            style={{
              color: "#FA541C",
              marginLeft: "10px",
              textDecoration: "underline",
            }}
          >
            gm
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 40,
            marginTop: "40px",
          }}
        >
          Say gm to Your Fans On{" "}
          <span
            style={{
              color: "#7e22ce",
              marginLeft: "10px",
              textDecoration: "underline",
            }}
          >
            Solana
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Satoshi Bold",
          data: satoshiBoldData,
        },
        {
          name: "Inter Medium",
          data: interMediumData,
        },
      ],
    }
  )

  const username = searchParams.get("username")

  if (!username) {
    return defaultResult
  }

  const user = await supabase.findUserUsername(username)

  if (!user) {
    return defaultResult
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
          padding: "80px",
          color: "white",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          backgroundPosition: "-30px -10px",
          backgroundColor: "#030303",
        }}
      >
        <div
          style={{
            fontSize: 80,
            display: "flex",
            marginBottom: 60,
          }}
        >
          Say{" "}
          <span
            style={{
              color: "#FA541C",
              marginLeft: "10px",
              marginRight: "10px",
              textDecoration: "underline",
            }}
          >
            gm
          </span>
          to @{username}
        </div>

        <img
          width="240"
          height="240"
          // @ts-ignore
          src={user.profile_metadata?.avatar}
          style={{
            borderRadius: 128,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Satoshi Bold",
          data: satoshiBoldData,
        },
        {
          name: "Inter Medium",
          data: interMediumData,
        },
      ],
    }
  )
}
