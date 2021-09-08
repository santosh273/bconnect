import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the AgrementProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Agrement {

  constructor(private platform: Platform,private alert:AlertController,private nativeStorage:NativeStorage) {
    console.log('Hello Agrement Provider');
  }
  private agreeChecked:false;
  showTandCPrompt() {
    let prompt = this.alert.create({enableBackdropDismiss: false});
    prompt.setTitle('GENERAL TERMS AND CONDITIONS');
    prompt.setMessage(this.tandC)
    prompt.addInput({
      type: 'checkbox',
      label: 'I Agree.',
      value: 'true',
      checked: this.agreeChecked,
      handler: data=>{
        console.log(data);
        this.agreeChecked=data.checked;
      }
    });
    prompt.addButton({
      text: 'Accept',
      handler: data => {
        console.log('Accept button Data:', data);
        if(this.agreeChecked){
          this.SaveAgrement();
        return true;
        }else{
          return false;
        }
      }
    });
    prompt.addButton({
      text: 'Exit',
      handler: data => {
        console.log('Exit button Data:', data);
        this.platform.exitApp();
      }
    });
    prompt.present();
  }

  CheckAgrement() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.nativeStorage.getItem('Agrement')//EmpIDX2
        .then(
        data => {
          console.log("Agrement Status:" + data);
          if(!data){
            console.log("not exist");
            resolve(false);
          }else{
            resolve(true);
            console.log("Exist");
          }
        },
        error => {
            reject(false);
        }
        );
      });
    });
  }
  SaveAgrement(){
    this.nativeStorage.setItem('Agrement', true)
    .then(
    () => console.log('Agrement Saved.'),
    error => console.error('Agrement Saved Error', error)
    );//userId ends
  }

  tandC=`<div text-justify>Bayer Pakistan (Private) Limited, a private limited company incorporated under the laws of the Islamic Republic of Pakistan (hereinafter referred to as “Bayer”, “we” or “us”), provides you with the “BConnect” mobile device application (the “Application”) under these Terms and Conditions (this “Agreement”). As used in these Terms and Conditions, ‘you’ or ‘users’ refers to individuals using the Application in connection with their own adherence activities or others, who may use the Application to supervise or support other users. By using the Application and/or by clicking the “I Agree” button, you unconditionally agree to follow and be bound by this Agreement, as well as the Legal Notices which consists of the (i) Conditions of Use; (ii) Privacy Statement; and (iii) Imprint. If you do not agree to be bound by and comply with all of the terms of this Agreement, you may not use our Application.
  <br><br>
  <b>INTENDED USERS</b>
  <br>
  This Application is strictly intended for the use of employees and dealers of Bayer’s CropScience Division only. Use and access of this Application by any other person outside the scope of intended users is prohibited and therefore deemed to be void. By accessing and using the Application, you represent and warrant that you are an employee of Bayer duly authorized by Bayer to use this Application. By accessing and using the Application, you represent and warrant that (a) any and all registration information you submit is truthful and accurate; (b) you will maintain the accuracy of such information; (c) your use of the Application will comply with and does not violate any applicable law, regulation, order or guideline.
  <br><br>
  <b>MODIFICATIONS OF THIS AGREEMENT</b>
  <br>
  We reserve the right to update or modify this Agreement, at any time and for any reason, without penalty or liability to you or any third party. By continuing to use the Application after any such changes, you unconditionally agree to follow and be bound by this Agreement as changed. For these reasons, we encourage you to periodically review this Agreement.
  <br><br>
  <b>DISCLAIMERS</b>
  <br>
  Your use of any aspect of the Application is at your own risk. We cannot and do not accept any liability in respect of any activities that you may undertake through using the Application.
  <br>
  If you use and/or access the Application on or from an Android device which you or someone else rooted or on or from an iOS device which you or someone else jail broke, Bayer shall not be responsible for the security of your data, including your Personal Information, and you shall bear all responsibility for any breach, illegal access, loss and/or corruption of such data.
  <br>
  We make no representations or warranties whatsoever in respect of the Application. Information regarding insecticides, pesticides, agricultural advice and otherwise may be provided by third parties. Any actions you take based on content, notifications and otherwise provided by the Application are taken at your sole risk and we will not accept any liability in respect thereof. You should always check any information provided through the Application to ensure its accuracy. To the maximum extent permitted by applicable law, the Application is provided on an “as is” and “as available” basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Application or any information, content, materials or products included or referenced therein. To the full extent permissible by applicable law, we disclaim all warranties, express or implied, including, but not limited to, implied warranties of merchantability, non-infringement of third parties’ rights and fitness for a particular purpose. We disclaim any implied or statutory warranties (i) regarding the security, accuracy, reliability, timeliness and performance of the Application; or (ii) that the Application will be error-free or that any errors will be corrected; or (iii) regarding the performance of or accuracy, quality, currency, completeness or usefulness of any information provided by the Application. We do not warrant that any description provided through the Application regarding products or otherwise is accurate, complete, reliable, current, safe or error-free. No communication, information or advice given by us or any representative of ours, whether written or oral, shall create any warranty. If you choose to rely on such information, you do so solely at your own risk. This disclaimer constitutes an essential part of this Agreement.
  <br><br>
  <b>REQUIREMENTS FOR USE</b>
  <br>
  In order to use the Application, you must have compatible computing and mobile devices, access to the Internet and mobile messaging and data services, and certain necessary software. Fees and charges may apply to your use the Internet or mobile services, and you may be required to purchase hardware or software to enable your devices to access the Application. You agree that you are responsible for meeting these requirements and for your use of the Internet, any associated fees, charges or expenses.
  <br><br><br>
  <b>TECHNOLOGY; SUPPORT</b>
  <br>
  We do not warrant or guarantee that the Application will function with your mobile or computing device or be compatible with the hardware or software on any particular devices. Information will be transmitted over a medium that will be beyond our control and jurisdiction; multiple factors, including network availability, may affect alert or notification delivery or otherwise interfere with the operation of the Application. We do not warrant or guarantee against, and therefore assume no liability for or relating to, any errors, omissions, delays, failures, interruptions, or corruption or loss of any data, alerts, notifications or other information transmitted in connection with your use of the Application, particularly relating to any failure of the reminder system to function as expected, including but not limited to the non-delivery of any alerts or notifications.
  <br>
  Without limiting the foregoing, we, our licensors, and our suppliers make no representations or warranties about the availability, accuracy, reliability, completeness, quality, performance, suitability or timeliness of the Application, Content, including software, text, graphics, links, or communications provided on or through the use of the Application.
  <br>
  We have no obligation to provide technical support or maintenance for the Application. At any time and for any reason, without notice or liability, we may modify or discontinue the Application or any part of it or impose limits on your use of or access to the Application.
  <br>
  Although we take reasonable measures to keep the Application free of viruses, worms, Trojan horses or other code that contain destructive properties, we do not warrant or guarantee that files available for downloading through the Application will be free of such contaminations.
  <br><br>
  <b>LOCATION DATA</b>
  <br>
  When using this Application, we may collect and process information about your actual location for providing certain services as part of the Applications features. For this purpose we may use various technologies to determine your location, including IP address, GPS and other sensors that may, for example, provide us with information on nearby devices, Wi-Fi access points and cell towers. You hereby give your consent for us to obtain your location for the purpose mentioned above.
  <br><br>
  <b>USER’S RESPONSIBILITIES</b>
  <br>
  If you submit any information to us through or related to the Application or send us any business information, feedback, idea, concept or invention to us by e-mail, you represent and warrant to us that such information is not confidential and that you have all necessary permission to submit or otherwise make available such information. In addition, you grant us a royalty-free, perpetual, irrevocable, world-wide nonexclusive license to use, reproduce, create derivative works from, modify, publish, edit, translate, distribute, perform, and display the communication or content in any media or medium, or any form, format, or forum now known or hereafter developed, including the right to sublicense through multiple tiers of sublicenses.
  <br><br>
  You further agree that:
  <br>
  <br>•	you will not reproduce, duplicate, copy, sell, resell, or exploit the Application, its Content, its software or any portion of any of the foregoing;
  <br>•	you will not use the Application for any purpose in violation of local, provincial, federal or international laws;
  <br>•	you will not solicit another person’s password or personal information under false pretenses;
  <br>•	you will not impersonate another person or entity or otherwise misrepresent your affiliation with a person or entity, and/or use or access another user’s account or password without permission;
  <br>•	you will not violate the legal rights of others, including defaming, abuse, stalking or threatening users;
  <br>•	you will not infringe the intellectual property rights, privacy rights, or moral rights of any third party;
  <br>•	you will not post or transmit any Content that is (or you reasonably believe or should reasonably believe to be) illegal, fraudulent, or unauthorized, or furthers such activity, or that involves (or you reasonably believe or should reasonably believe to involve) any stolen, illegal, counterfeit, fraudulent, pirated, or unauthorized material;
  <br>•	you will not publish falsehoods or misrepresentations, including with respect to any information; and
  <br>•	you will not post or transmit any Content that is (or reasonably should be understood to be) libelous, defamatory, obscene, offensive (including material promoting or glorifying hate, violence, or bigotry or otherwise inappropriate to the community ethos of the Application).
  <br><br>
  You agree not to interfere or attempt to interfere with the proper working of the Application or to disrupt the operations or violate the security of the Application. Violations of system or network operation or security may result in civil or criminal liability. We will investigate possible occurrences of such violations, and we may involve and cooperate with law enforcement authorities in prosecuting anyone involved with such violations. You agree to comply with all user responsibilities and obligations as stated in this Agreement. Non-enforcement or our failure to act with respect to a breach by you or others of this Agreement does not constitute consent or waiver, and we reserve the right to enforce such term at our sole discretion. No waiver of any breach or default hereunder shall be deemed to be a waiver of any preceding or subsequent breach or default. Nothing contained in this Agreement shall be construed to limit the actions or remedies available to us with respect to any prohibited activity or conduct.
  <br><br>
  <b>LICENSE GRANT</b>
  <br>
  We hereby grant to you a limited, non-exclusive, non-assignable, non-sublicensable license to access and use our Application, and any user guides, specifications or related documentation (the “Documentation”), subject to the terms and conditions of this Agreement. This license is only for your personal and non-commercial use and only for the term of this Agreement. To the extent not limited or restricted under any applicable law or regulation, you are granted permission to temporarily download one copy of the Application for personal, non-commercial use only on each mobile device that you own or control. You may not distribute or make the Application available for use by others on multiple devices simultaneously. Under this license, except as and only to the extent any of the following restrictions are prohibited by applicable law or any of the restricted activities are permitted by the licensing terms of any open-sourced components incorporated into the App, you may not:
  <br><br>
  <br>•	lend, rent, lease, sell, redistribute, assign, sublicense or otherwise transfer the Application or the right to download or use the App;
  <br>•	use the Application for any commercial purpose or for any commercial or non-commercial public display;
  <br>•	copy, decompile, reverse engineer, disassemble, attempt to derive the source code of the App, any Application updates, or any part of the Application or updates, or attempt to do any of the foregoing;
  <br>•	copy, modify or create derivative works of the Application, Documentation any Application or Documentation updates or any part of the Application, Documentation or updates;
  <br>•	remove any copyright or other proprietary notices from the App, Documentation, part of the Application;
  <br>•	transfer the Content or materials from the Application to anyone else or “mirror” the same on any server;
  <br>•	circumvent, disable, or otherwise interfere with security-related features of the Application or features that prevent or restrict use or copying of any content;
  <br>•	use any robot, spider, site search or retrieval application, or any other manual or automatic device or process to retrieve, index, data-mine, or in any way reproduce or circumvent the navigational structure or presentation of the Application;
  <br>•	harvest, collect or mine information about other users of the Application;
  <br>•	post or transmit any virus, worm Trojan horse or other harmful or disruptive element; or
  <br>•	violate any applicable law, rule or regulation.
  <br><br>
  If you violate any of these restrictions, this license will automatically terminate, and you may be subject to prosecution and damages.
  <br><br>
  <b>OWNERSHIP</b>
  <br>
  Bayer and its licensors own the Documentation and App, including any material or Content made available through the Application, including our proprietary algorithm, and all worldwide intellectual property rights in the foregoing. Except as expressly permitted herein, you may not copy, further develop, reproduce, republish, modify, alter download, post, broadcast, transmit or otherwise use any material made available in the Application. You will not remove, alter or conceal any copyright, trademark, service mark or other proprietary rights notices incorporated in the Application. All trademarks are trademarks or registered trademarks of their respective owners. Nothing in this Agreement grants you any right to use any trademark, service mark, logo, or trade name of ours or any third party.
  <br><br>
  <b>LIMITATIONS ON LIABILITY</b>
  <br>
  To the maximum extent permitted by applicable law, under no circumstances and under no legal or equitable theory, whether in tort, contract, strict liability or otherwise, shall we, our affiliates, or any of our or their employees, directors, officers, agents, vendors or suppliers be liable to you or to any third party for any personal injury, including death, or for any indirect, special, incidental or consequential losses or damages of any nature arising out of or in connection with the use of or inability to use the Application, including, without limitation, damages for lost profits, loss of goodwill, loss of data, work stoppage, accuracy of results, or computer or device failure or malfunction, even if a representative of ours has been advised of or should have known of the possibility of such damages. In addition to the foregoing, we assume no responsibility for any error, omission, interruption, deletion, defect, delay in operation or transmission or communications line failure. We are not responsible for any problems or technical malfunction of any telephone or cellular phone network or lines, computer online systems, servers or providers, computer equipment, software, failure of any e-mail due to technical problems or traffic congestion on the Internet, including any injury or damage to users or to any person’s mobile device or computer related to or resulting from participation or use of the Application. Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain damages. Accordingly, some of the above limitations and disclaimers may not apply to you. To the extent that we may not, as a matter of applicable law, disclaim any implied warranty or limit liabilities, the scope and duration of such warranty and the extent of our liability will be the minimum permitted under such applicable law.
  <br><br>
  Any claims arising in connection with your use of the Application must be brought within one (1) year of the date of the event giving rise to such action occurred. Remedies under this Agreement are exclusive and are limited to those expressly provided for in this Agreement, even if the applicable remedy under this Agreement fails of its essential purpose.
  <br><br>
  <b>INDEMNITY</b>
  <br>
  You agree to defend, indemnify, and hold us harmless including our officers, directors, employees, agents, subcontractors, licensors and suppliers, any of our affiliated companies or organizations, and any successors, assigns or licensees, from and against any claims, actions or demands, damages, losses, liabilities, judgments, settlements, costs or expenses (including attorneys’ fees and costs) arising directly or indirectly from or relating to a) the breach of this Agreement by you or anyone using your computer, mobile device, password or login information; (b) any claim, loss or damage experienced from your use or attempted use of (or inability to use) the Application; (c) your violation of any law or regulation; or (d) any other matter for which you are responsible under this Agreement or under law. You agree that your use of the Application shall be in compliance with all applicable laws, regulations and guidelines.
  <br><br>
  <b>TERMINATION</b>
  <br>
  This Agreement is effective until terminated by either you or us. You may terminate this Agreement at any time, provided that you discontinue any further use of the Application. If you violate this Agreement, our permission to you to use the Application automatically terminates. We may, in our sole discretion, terminate this Agreement and your access to any or all of the Application, at any time and for any reason, without penalty or liability to you or any third party. In the event of your breach of this Agreement, these actions are in addition to and not in lieu or limitation of any other right or remedy that may be available to us. Upon any termination of the Agreement by either you or us, you must promptly uninstall the Application on all of your devices and destroy all materials downloaded or otherwise obtained from the Application, all Documentation, and all copies of such materials and Documentation. The following provisions survive the expiration or termination of this Agreement for any reason whatsoever: Disclaimers, Ownership, Limitations on Liability, Indemnity, Choice of Law and Forum, Entire Agreement and Severability.
  <br><br>
  <b>CHOICE OF LAW AND FORUM</b>
  <br>
  This Agreement shall be governed in all respects under the laws of the Pakistan. In any claim or action by you directly or indirectly arising under this Agreement or related to the Application, you irrevocably agree to submit to the exclusive jurisdiction of the courts located in Sindh. You waive any jurisdictional, venue or inconvenient forum objections to any of these courts that may have jurisdiction.</div>`;
}
