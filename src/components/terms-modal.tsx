'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface TermsModalProps {
  onAgree: () => void;
}

export default function TermsModal({ onAgree }: TermsModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle> Terms & Conditions and Privacy Policy for Emoji Sliderz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please read these terms and conditions carefully before using the application.
            </p>
            <div className="h-48 overflow-y-auto p-2 border rounded-md">
              <p> Last Updated: [23/09/2025] </p>
              <p>
                Welcome to Emoji Sliderz (the Game), developed and provided by Yogesh Chaudhary (we, our, or us). By
                downloading, accessing, or playing the Game, you agree to these Terms and Conditions and Privacy
                Policy. If you do not agree, please do not use the Game.
              </p>
              <h3 className="font-bold mt-4">Free to Play and Advertising</h3>
              <p>Emoji Sliderz is free to download and play.</p>
              <p>The Game is supported by third party advertising networks including Google AdMob.</p>
              <p>
                By using the Game, you acknowledge and agree that advertisements will be displayed and that these ads
                are necessary for us to provide the Game free of charge.
              </p>
              <p>
                We are not responsible for the content of third party ads. Clicking on any advertisement may take you to
                a third party service or website, and you do so at your own risk.
              </p>
              <p>
                You may be offered optional in app rewards such as extra lives or bonuses in exchange for viewing
                advertisements.
              </p>
              <h3 className="font-bold mt-4">Eligibility</h3>
              <p>
                You must be at least 13 years old, or the minimum legal age required in your country, to play the Game.
              </p>
              <p>If you are under 18, you must have parental or guardian consent to use the Game.</p>
              <h3 className="font-bold mt-4">Use of the Game</h3>
              <p>By using the Game, you agree that you will play only for personal, non commercial entertainment purposes.</p>
              <p>
                You may not copy, modify, reverse engineer, decompile, or distribute any part of the Game without
                written permission.
              </p>
              <p>You may not use cheats, automation software, bots, or hacks to alter gameplay.</p>
              <p>
                You may not engage in any conduct that could disrupt or negatively affect the experience of other
                players.
              </p>
              <h3 className="font-bold mt-4">Information We Collect</h3>
              <p>We may collect the following types of information when you use the Game</p>
              <h4 className="font-bold mt-2">a. Non Personal Information</h4>
              <ul className="list-disc list-inside">
                <li>Device information such as model, operating system, and unique identifiers.</li>
                <li>Gameplay activity such as levels played, progress, and in app actions.</li>
                <li>Log data such as IP address, crash reports, and performance data.</li>
                <li>Ad interaction data such as views, clicks, and frequency.</li>
              </ul>
              <h4 className="font-bold mt-2">b. Personal Information</h4>
              <p>We do not require you to create an account or provide personal information to play the Game.</p>
              <p>
                However, third party services such as Google AdMob may collect information such as your advertising ID
                for personalized ad experiences.
              </p>
              <h4 className="font-bold mt-2">c. Childrens Data</h4>
              <p>
                We do not knowingly collect personal information from children under 13 or the minimum legal age in
                your country.
              </p>
              <p>
                If you believe we have collected such information, please contact us immediately and we will take steps
                to delete it.
              </p>
              <h3 className="font-bold mt-4">How We Use Information</h3>
              <ul className="list-disc list-inside">
                <li>We use collected information to provide and improve the Game.</li>
                <li>We use it to show ads that support our free to play model.</li>
                <li>We use it to analyze gameplay trends to enhance user experience.</li>
                <li>We use it to detect and fix bugs, crashes, or performance issues.</li>
              </ul>
              <h3 className="font-bold mt-4">Third Party Services and Advertising</h3>
              <p>
                The Game uses third party services including but not limited to Google AdMob for advertisements and
                Google Play Services for analytics, updates, and distribution.
              </p>
              <p>These third parties may collect and use information as described in their own Privacy Policies.</p>
              <p>
                Google AdMob: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500">https://policies.google.com/technologies/ads</a>
              </p>
              <p>
                Google Play Services: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500">https://policies.google.com/privacy</a>
              </p>
              <p>We are not responsible for third party privacy practices.</p>
              <h3 className="font-bold mt-4">Advertising and Cookies</h3>
              <p>
                Ads in the Game may be personalized or non personalized depending on your device settings and region.
              </p>
              <p>
                Third party ad networks may use cookies, identifiers, and tracking technologies to deliver ads more
                effectively.
              </p>
              <p>You can control ad personalization through your device settings.</p>
              <p>On Android: Settings &gt; Google &gt; Ads &gt; Opt out of Ads Personalization</p>
              <p>On iOS: Settings &gt; Privacy &gt; Advertising</p>
              <h3 className="font-bold mt-4">Data Sharing</h3>
              <p>We do not sell, rent, or trade your information.</p>
              <p>
                Data may be shared with service providers such as Google AdMob and analytics providers, or with
                authorities if required by law.
              </p>
              <h3 className="font-bold mt-4">Data Security</h3>
              <p>
                We take reasonable steps to protect your information from unauthorized access, alteration, or
                disclosure.
              </p>
              <p>
                No method of data transmission or storage is completely secure, so we cannot guarantee absolute
                security.
              </p>
              <h3 className="font-bold mt-4">Intellectual Property</h3>
              <p>
                All rights, title, and interest in the Game including graphics, logos, sounds, and software are owned
                by Yogesh Chaudhary or licensed to us.
              </p>
              <p>You may not use our intellectual property without prior written approval.</p>
              <h3 className="font-bold mt-4">Updates and Availability</h3>
              <p>We may update, modify, or discontinue parts of the Game at any time without notice.</p>
              <p>
                We do not guarantee that the Game will always be available, error free, or compatible with all devices.
              </p>
              <p>Updates may include bug fixes, new features, or changes to ads and gameplay.</p>
              <h3 className="font-bold mt-4">Disclaimer of Warranties</h3>
              <p>The Game is provided as is and as available.</p>
              <p>
                We make no warranties or guarantees regarding uninterrupted gameplay, absence of bugs, or suitability
                for your device.
              </p>
              <p>Your use of the Game is at your own risk.</p>
              <h3 className="font-bold mt-4">Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Yogesh Chaudhary shall not be liable for any damages, losses,
                or claims arising from your use of or inability to use the Game, advertisements displayed in the Game,
                or third party websites, apps, or services accessed via ads.
              </p>
              <p>Your sole remedy for dissatisfaction with the Game is to stop using it.</p>
              <h3 className="font-bold mt-4">Termination</h3>
              <p>
                We reserve the right to suspend or terminate your access to the Game at any time without prior notice
                if you violate these Terms.
              </p>
              <h3 className="font-bold mt-4">Your Rights and Choices</h3>
              <p>Depending on your region, you may have rights to access, correct, or delete certain data.</p>
              <p>You may opt out of personalized advertising.</p>
              <p>You may request information on how your data is used.</p>
              <p>You can manage most of these settings directly on your device.</p>
              <h3 className="font-bold mt-4">Governing Law</h3>
              <p>These Terms are governed by the laws of your country or state.</p>
              <p>Any disputes will be resolved exclusively in the courts of your country or state.</p>
              <h3 className="font-bold mt-4">Changes to This Policy</h3>
              <p>We may update these Terms and Conditions and Privacy Policy from time to time.</p>
              <p>
                If changes are made, the updated version will be available within the Game and or on our website, with
                the Last Updated date revised.
              </p>
              <p>Continued use of the Game after updates means you accept the revised Terms and Policy.</p>
              <h3 className="font-bold mt-4">Contact Us</h3>
              <p>
                If you have any questions or concerns about these Terms and Conditions or our Privacy Policy, please
                contact us at
              </p>
              <p>Email: venusdigital600@gmail.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the terms and conditions
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onAgree} disabled={!isChecked} className="w-full">
            Agree
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
